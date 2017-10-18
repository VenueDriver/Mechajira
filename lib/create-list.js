const util = require('util')
const fs = require('fs')
const yaml = require('js-yaml')
const chalk = require('chalk')

const Jira = require('./jira')

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

  // Get a JIRA API connection.
  var jira = new Jira(this.configData)

  // Create a JIRA issue for each summary in the command file.
  for (var i = 0, length = commandData.summaries.length; i < length; i++) {
    var summary = commandData.summaries[i]
    if(!this.configData['silent']) {
      console.log('Creating issue for ' + chalk.bold.cyan(`${summary}...`))
    }
    var issueData = {
      'project': commandData.project,
      'issuetype': commandData.issuetype,
      'summary': `${commandData.summary} ${summary}`,
      'description': `${commandData.description} ${summary}`,
      'epic': commandData.epic
    }
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

// Combines a hash of common fields with a hash of fields for a specific issue.
// For combining the common fields from the root of the YAML command file with
// the specific issue fields from the list of issues in the command file.
CreateList.prototype.mergedIssueFromCommonValues =
  function(common_fields, issue_fields) {
    return Object.assign(issue_fields, common_fields);
}

module.exports = CreateList
