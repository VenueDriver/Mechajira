const util = require('util')
const fs = require('fs')
const yaml = require('js-yaml')
const chalk = require('chalk')
Liquid = require("liquid-node")

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
  async function(commonFields, issueFields) {

    // Make a copy of the common fields, and interpolate the specific issue
    // values into the values in that hash.
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
    return Object.assign(issueFields, interpolatedCommonFields);
}

module.exports = CreateList
