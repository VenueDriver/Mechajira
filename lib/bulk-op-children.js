const util = require('util')
const fs = require('fs')
const yaml = require('js-yaml')
const chalk = require('chalk')
Liquid = require("liquid-node")

const Jira = require('./jira')

// Show real stack traces for unhandled promise rejection exceptions.
process.on('unhandledRejection', r => console.log(r)) // Why isn't this the default?

class BulkOpChildren {

  constructor(configData) {
    this.configData = configData
  }

  async process(key, op, fields) {

    var children = await this.findChildren(key);

    if(!this.configData['silent']) {
      console.log(chalk.bold.cyan('Performing') +
        ' bulk operation ' + chalk.bold.cyan(op))
    }

    switch (op) {
      case 'del':
        // logic to run if operation 'delete' is passed in
        console.log("Deleting..." + children);
        break;
      case 'c' || 'close':
        // logic to run if operation 'close' is passed in
        console.log("Closing..." + children);
        break;
      case 'e' || 'edit':
        // logic to run if operation 'edit' is passed in
        console.log("Editing..." + children);
        break;
    }
  }

  async findChildren(key) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData);

    console.log('Finding children of ' + key);
    var children = await jira.findChildren(key);
    for (var i = 0, length = children.length; i < length; i++) {
      console.log(children[i]);
    }
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

module.exports = BulkOpChildren
