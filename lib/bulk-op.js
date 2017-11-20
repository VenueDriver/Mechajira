const util = require('util')
const fs = require('fs')
const yaml = require('js-yaml')
const chalk = require('chalk')
Liquid = require("liquid-node")

const Jira = require('./jira')

// Show real stack traces for unhandled promise rejection exceptions.
process.on('unhandledRejection', r => console.log(r)) // Why isn't this the default?

class BulkOp {

  constructor(configData) {
    this.configData = configData
  }

  async process(key, op, options) {

    var descendents = await this.findDescendents(key);

    if(!this.configData['silent']) {
      console.log(chalk.bold.cyan('Performing') +
        ' bulk operation ' + chalk.bold.cyan(op))
    }

    if (op == 'del') {
      // logic to run if operation 'delete' is passed in
      console.log("Deleting..." + descendents);
    } else if (op == 'c' || op == 'close') {
      // logic to run if operation 'close' is passed in
      console.log("Closing..." + descendents);
      this.closeIssues(descendents);
    } else if (op == 't' || op == 'trans') {
      // logic to run if operation 'trans' is passed in
      console.log("Transitioning " + descendents + " to transID " + options);
      this.transIssues(descendents, options);
    } else if (op == 'e' || op == 'edit') {
      // logic to run if operation 'edit' is passed in
      console.log("Editing..." + descendents);
    } else if (op == 'gt' || op == 'gettrans') {
      // logic to run if operation 'edit' is passed in
      this.getTrans(key);
    }
  }

  async findDescendents(key) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData);

    console.log('Finding descendents of ' + key);
    var descendents = await jira.findDescendents(key);
    for (var i = 0, length = descendents.length; i < length; i++) {
      console.log(descendents[i]);
    }
    return descendents;
  }

  async closeIssues(descendents) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData);

    for (var i = 0, length = descendents.length; i < length; i++) {
      console.log("Closing " + descendents[i]);
      await jira.closeIssue(descendents[i]);
    }
  }

  async getTrans(key) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData);

    console.log('Finding transitions for ' + key);
    var transitions = await jira.getTrans(key);
    console.log(transitions);
  }

  async transIssues(descendents, transID) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData);

    for (var i = 0, length = descendents.length; i < length; i++) {
      console.log("Transitioning " + descendents[i]);
      await jira.transIssue(descendents[i], transID);
    }
  }

  async editIssues(descendents, fields) {
    // Get a JIRA API connection.
    var jira = new Jira(this.configData)

    // Create a JIRA issue for each summary in the command file.
    for (var i = 0, length = descendents.length; i < length; i++) {
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

module.exports = BulkOp
