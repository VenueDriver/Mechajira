const util = require('util')
const fs = require('fs')
const yaml = require('js-yaml')
const chalk = require('chalk')
Liquid = require("liquid-node")

const Jira = require('./jira')

// Show real stack traces for unhandled promise rejection exceptions.
process.on('unhandledRejection', r => console.log(r)) // Why isn't this the default?

function CreateList(configData) {
  this.configData = configData
}

CreateList.prototype.process = async function (commandFile = 'command.yml') {

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
CreateList.prototype.processSummaries = async function(commandData) {

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
CreateList.prototype.processIssues = async function(commandData) {

  // Get a JIRA API connection.
  var jira = new Jira(this.configData)

  // Create a JIRA issue for each summary in the command file.
  for(var i=0, length = commandData.issues.length; i<length; i++) {

    // Make a copy of the command data, without the issues key.
    var issueFields = Object.assign({}, commandData.issues[i])

    if(!this.configData['silent']) {
      console.log('Creating issue for ' +
        chalk.bold.cyan(`${issueFields.summary}...`))
    }

    // Make a copy of the command data, without the issues key.
    var templateFields = Object.assign({}, commandData.template)
    delete templateFields.issues

    // Merge the common fields and the fields for the specific issue.
    var mergedFields = await this.mergedIssueFromCommonValues(
      templateFields,
      issueFields)
    // Not really fields.
    delete mergedFields.id
    delete mergedFields.links
    delete mergedFields.subtasks
    if(this.configData['verbose']) {
      console.log('Issue fields:')
      console.dir(mergedFields)
    }

    var jiraIssue;
    try {
      jiraIssue = await jira.createIssue(mergedFields)
      if(!this.configData['silent']) {
        console.log(chalk.bold.green(`${jiraIssue.key} created`) +
          ' for ' + chalk.bold.cyan(`${mergedFields.summary}`))
      }
    } catch (error) {
      console.log(chalk.bold.red(error))
    }

    // If there are any sub-tasks for this new issue, then create them
    // now that we know the ID of the new issue.
    if(issueFields.subtasks) {

      // Massage the common fields for sub-tasks.  That means
      // removing the epic field, and adding a parent field.
      var commonSubTaskFields = Object.assign({}, templateFields)
      if(commonSubTaskFields.epic){ delete commonSubTaskFields.epic }
      commonSubTaskFields.parent = jiraIssue.key
      commonSubTaskFields.issuetype = 'Sub-task'

      for(var i=0, length=issueFields.subtasks.length; i<length; i++){
        var subTaskFields = Object.assign({}, issueFields.subtasks[i])

        var mergedSubTaskFields = await this.mergedIssueFromCommonValues(
          commonSubTaskFields,
          subTaskFields)
        if(this.configData['verbose']) {
          console.log('Sub-Task fields:')
          console.dir(mergedSubTaskFields)
        }

        try {
          var jiraIssue = await jira.createIssue(mergedSubTaskFields)
          if(!this.configData['silent']) {
            console.log(chalk.bold.green(`${jiraIssue.key} created`) +
              ' sub-task ' + chalk.bold.cyan(`${mergedFields.summary}`))
          }
        } catch (error) {
          console.log(chalk.bold.red(error))
          console.dir(error)
        }
      }
    }

  }
}

// Combines a hash of common fields with a hash of fields for a
// specific issue.  For combining the common fields from the root of
// the YAML command file with the specific issue fields from the list
// of issues in the command file.
CreateList.prototype.mergedIssueFromCommonValues =
  async function(commonFields, issueFields) {

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

module.exports = CreateList
