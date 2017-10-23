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
  }

  async process(commandFile = 'command.yml') {

    if(!this.configData['silent']) {
      console.log(chalk.bold.cyan('Creating List') +
        ' from command file ' + chalk.bold.cyan(commandFile))
    }

    // Read the command data from the YAML file.
    const commandData = yaml.safeLoad(fs.readFileSync(commandFile, 'utf8'))

    // Either loop over a list of summaries or a list of issue hashes,
    // depending on which of the two is included in the command file.
    if(commandData.summaries) {
      await this.processSummaries(commandData)
    } else if(commandData.issues) {
      await this.processIssues(commandData)
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

  // This function is available for creating lists programmatically.
  async processIssues(issueList, issueRecordsKey='issues') {

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
        // If there is not a "template:" key, then the issue itself is the template.
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
        await this.processIssues(newContext)
      }

      // If there are any sub-tasks for this new issue, then create them
      // now that we know the ID of the new issue.
      if(issueFields['sub-tasks']) {
        await this.processIssues(
          {
            project: issueFields.project,
            'key': issueFields.key,
            'sub-tasks': issueFields['sub-tasks']
          }, 'sub-tasks')
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

}

module.exports = CreateList
