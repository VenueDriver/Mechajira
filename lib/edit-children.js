const util = require('util')
const fs = require('fs')
const yaml = require('js-yaml')
const chalk = require('chalk')
Liquid = require("liquid-node")

const Jira = require('./jira')

// Show real stack traces for unhandled promise rejection exceptions.
process.on('unhandledRejection', r => console.log(r)) // Why isn't this the default?

class EditChildren {

  constructor(configData) {
    this.configData = configData
    // For storing a list of child keys
    this.childKeys = {}
  }

  async process(commandFile = 'command.yml') {

    if(!this.configData['silent']) {
      console.log(chalk.bold.cyan('Reading') +
        ' command file ' + chalk.bold.cyan(commandFile))
    }

    // Read the command data from the YAML file.
    const commandData = yaml.safeLoad(fs.readFileSync(commandFile, 'utf8'))

    // If command data has a 'parent' property, then use that property to find all children first
    // then edit the issues according to the properties in the commandfile
    if(commandData.parent) {
      var children = await this.findChildren(commandData)
      await this.editChildren(children, commandData)
    } else {
    // If command data does not have a 'parent' property, then use the <key> value in argv to
    // find all the children first
      await this.editChildren(commandData)
    }
  }

  async findChildren(commandData) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData);

    console.log('Finding children of ' + commandData.parent);
    var parent = commandData.parent;
    var children = await jira.findChildren(parent);
    return children;
  }

  async editChildren(children, commandData) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData)

    // Create a JIRA issue for each summary in the command file.
    for (var i = 0, length = children.length; i < length; i++) {
      console.log(children[i]);
      /*
      var summary = commandData.summaries[i]
      if(!configData['silent']) {
        console.log('Editing issue for ' + chalk.bold.cyan(`${summary}...`))
      }
      var issueData = {
        'project': commandData.project,
        'issuetype': commandData.issuetype,
        'summary': `${commandData.summary} ${summary}`,
        'description': `${commandData.description} ${summary}`,
        'epic': commandData.epic
      }
      try {
        var jiraIssue = await jira.editIssue(issueData)
        if(!configData['silent']) {
          console.log(chalk.bold.green(`${jiraIssue.key} edited`)
        }
      } catch (error) {
        console.log(chalk.bold.red(error))
      }
      */
    }
  }
}

module.exports = EditChildren
