const util = require('util')
const fs = require('fs')
const jiraClient = require('jira-connector')
const yaml = require('js-yaml')
const chalk = require('chalk')

const findChildren = require('./find-children').findChildren
const Jira = require('./jira')

// Show real stack traces for unhandled promise rejection exceptions.
process.on('unhandledRejection', r => console.log(r)) // Why isn't this the default?

class EditChildren {

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

    // If command data has a 'parent' property, then use that property to find all children
    if(commandData.parent) {
      await this.findChildren(commandData)
      await this.editIssues(commandData)
    } else {
      console.log("WTF do you want to do again?!")
    }
  }

  async findChildren(commandData) {
    console.log(commandData.parent)    // <-- this works, so commandData is recognized within this scope
    var parent = commandData.parent
    findChildren(this.configData, parent)   // <-- cannot read property 'parent' of undefined, problem myst be within findChildren function
  }

  async editIssues(children, commandData) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData)

    console.log(children)

    // Create a JIRA issue for each summary in the command file.
    for (var i = 0, length = children.issues.length; i < length; i++) {
      console.log(children.issue)
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
