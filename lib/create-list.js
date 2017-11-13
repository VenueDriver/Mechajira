const util = require('util')
const fs = require('fs')
const yaml = require('js-yaml')
const chalk = require('chalk')
Liquid = require("liquid-node")

const Jira = require('./jira')

// Show real stack traces for unhandled promise rejection exceptions.
process.on('unhandledRejection', r => console.log(r)) // Why isn't this the default?

class CreateList {

  constructor(configData) {
    this.configData = configData
    // For storing the keys of created issues, by ID or by summary.
    this.createdKeys = {
      id: {},
      summary: {}
    }
    // For storing a list of keys that need to be linked to other keys.
    this.linksFromKeys = {}
  }

  async process(commandFile = 'command.yml') {

    if(!this.configData['silent']) {
      console.log(chalk.bold.cyan('Editing children') +
        ' from command file ' + chalk.bold.cyan(commandFile))
    }

    // Read the command data from the YAML file.
    const commandData = yaml.safeLoad(fs.readFileSync(commandFile, 'utf8'))

    // Either loop over a list of summaries or a list of issue hashes,
    // depending on which of the two is included in the command file.
    if(commandData.summaries) {
      await this.processSummaries(commandData)
    } else if(commandData.issues) {
      await this.createIssues(commandData)
      await this.linkIssues()
    }
  }

  // This function is available for creating lists programmatically from a hash.
  async processSummaries(commandData) {

    // Get a JIRA API connection.
    var jira = new Jira(this.configData)

    // Create a JIRA issue for each summary in the command file.
    for (var i = 0, length = commandData.summaries.length; i < length; i++) {
      var summary = commandData.summaries[i]
      if(!this.configData['silent']) {
        console.log('Creating issue for ' + chalk.bold.cyan(`${summary}...`))
      }
      // Make a copy of the command data, without the issues key.
      var commonFields = Object.assign({}, commandData)
      delete commonFields.summaries
      var issueData = await this.mergedIssueFromCommonValues(
        commonFields,
        {
         'summary': summary,
         'description': summary,
        })
      try {
        var jiraIssue = await jira.createIssue(issueData)
        if(!this.configData['silent']) {
          console.log(chalk.bold.green(`${jiraIssue.key} created`) + ' for ' +
            chalk.bold.cyan(`${summary}`))
        }
      } catch (error) {
        console.log(chalk.bold.red(error))
      }
    }
  }

  // Create the issues in the command data.
  async createIssues(issueList, issueRecordsKey='issues') {

    // Get a JIRA API connection.
    var jira = new Jira(this.configData)

    // Find the list of issue records to process.  Skip out if there are none.
    if(!issueList[issueRecordsKey]) { return }
    var issueRecords = issueList[issueRecordsKey]

    // Create a JIRA issue for each summary in the command file.
    for(var i=0, length = issueRecords.length; i<length; i++) {

      // Make a copy of the command data, without the issues key.
      var issueFields = Object.assign({}, issueRecords[i])

      if(!this.configData['silent']) {
        console.log('Creating issue for ' +
          chalk.bold.cyan(`${issueFields.summary}...`))
      }

      // Find the template to use for creating new issues.
      var templateFields = {}
      // Look for 'sub-task-template' for sub-task lists.
      if(issueRecordsKey == 'sub-tasks' && issueList['sub-task-template']) {
        templateFields = Object.assign({}, issueList['sub-task-template'])
      }
      // Look for 'template' otherwise.
      else if(issueList.template) {
        templateFields = Object.assign({}, issueList.template)
      } else {
        // If there is not a "template:" key, then the issue is the template.
        templateFields = Object.assign({}, issueList)
      }

      // Get the project from the parent if necessary.
      if(!issueFields.project) {
        issueFields.project = templateFields.project
      }

      // Merge the common fields and the fields for the specific issue.
      var mergedFields = await this.mergedIssueFromCommonValues(
        templateFields,
        issueFields)
      // Not really fields.
      delete mergedFields.id
      delete mergedFields.key
      delete mergedFields.links
      delete mergedFields['sub-tasks']
      delete mergedFields.issues
      if(issueRecordsKey == 'sub-tasks') {
        mergedFields.type = 'Sub-task'
        mergedFields.parent = issueList.key
      }
      // Create a description from the summary if there is none specified.
      if(!mergedFields.description){
        mergedFields.description = mergedFields.summary
      }
      if(this.configData['verbose']) {
        console.log('Issue fields:')
        console.dir(mergedFields)
      }

      var jiraIssue;
      try {
        jiraIssue = await jira.createIssue(mergedFields)
        issueFields.key = jiraIssue.key

        // Store the key of the created issue.
        this.createdKeys.summary[issueFields.summary] = jiraIssue.key
        if(issueFields.id) {
          this.createdKeys.id[issueFields.id] = jiraIssue.key
        }

        // If there are any links for this issue, then store those with the
        // new key so that the links can be established later.
        if(issueFields.links) {
          this.linksFromKeys[jiraIssue.key] = issueFields.links
        }

        if(!this.configData['silent']) {
          console.log(chalk.bold.green(`${jiraIssue.key} created`) +
            ' for ' + chalk.bold.cyan(`${mergedFields.summary}`))
        }
      } catch (error) {
        console.log(chalk.bold.red(JSON.stringify(error)))
      }

      // Recurse into nested issue lists.
      if(issueFields.issues) {
        var newContext = {
          project: issueFields.project,
          'key': issueFields.key,
          issues: issueFields.issues
        }
        if(issueFields.type == 'Epic') {
          newContext.epic = issueFields.key
        }
        await this.createIssues(newContext)
      }

      // If there are any sub-tasks for this new issue, then create them
      // now that we know the ID of the new issue.
      if(issueFields['sub-tasks']) {
        await this.createIssues(
          {
            project: issueFields.project,
            'key': issueFields.key,
            'sub-tasks': issueFields['sub-tasks']
          }, 'sub-tasks')
      }
    }

    this.createdKeys.summary[mergedFields.summary]
  }

  // Link the issues in the command data.
  async linkIssues() {

    // Get a JIRA API connection.
    var jira = new Jira(this.configData)

    // Loop through the keys that were created for issues with links.
    var linkFromIssues = Object.keys(this.linksFromKeys)
    for(var i=0, length = linkFromIssues.length; i<length; i++) {
      var linkFromIssue = linkFromIssues[i]

      // Find the link types for this issue.
      var links = this.linksFromKeys[linkFromIssue]

      for(var j=0, linksLength = links.length; j<linksLength; j++) {
        var link = links[j]

        var linkType = Object.keys(link)[0]
        var linkTargets = link[linkType]

        for(var k=0, linkTargetsLength = linkTargets.length;
          k<linkTargetsLength; k++) {
          var linkTarget = linkTargets[k]

          try {
            var linkTargetKey = this.linkTargetKey(linkTarget)
            var result =
              await jira.linkIssue(linkType,
                linkFromIssue, linkTargetKey)

            if(!this.configData['silent']) {
              console.log(chalk.bold.green('Linked: ') +
                chalk.bold.cyan(linkFromIssue) + ' ' +
                chalk.bold.cyan(linkType) + ' ' +
                chalk.bold.cyan(linkTargetKey))
            }
          } catch (error) {
            console.log(chalk.bold.red(JSON.stringify(error)))
          }
        }
      }
    }
  }

  // Combines a hash of common fields with a hash of fields for a
  // specific issue.  For combining the common fields from the root of
  // the YAML command file with the specific issue fields from the list
  // of issues in the command file.
  async mergedIssueFromCommonValues(commonFields, issueFields) {
      // Make a copy of the common fields, and interpolate the specific
      // issue values into the values in that hash.
      var interpolatedCommonFields = {}
      var engine = new Liquid.Engine
      for (const [key, value] of Object.entries(commonFields)) {
        await engine
          .parseAndRender(value, issueFields)
          .then(function(result) {
            interpolatedCommonFields[key] = result }
          )
          .catch(function(error) { console.log(error) })
      };

      // Merge the interpolated common fields into the issue fields.
      return Object.assign({}, issueFields, interpolatedCommonFields);
  }

  // Find the key of a newly-created issue, by looking up the string as an
  // explicit ID or as a summary string.
  linkTargetKey(linkTarget) {

    // Find JIRA issue key by the ID of the target issue.
    if(this.createdKeys.id[linkTarget]) {
      return this.createdKeys.id[linkTarget]
    // Find JIRA issue key by the summary of the target issue.
    } else if(this.createdKeys.summary[linkTarget]) {
      return this.createdKeys.summary[linkTarget]
    } else {
      // Treat the target issue string as a literal JIRA issue key.
      return linkTarget
    }
  }

}

module.exports = CreateList
