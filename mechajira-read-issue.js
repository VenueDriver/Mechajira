#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

// Returns a hash of configuration values.
const configData = require('./lib/config').configData;
// Performs the API call.
const Jira = require('./lib/jira');

program
  .description('Print the data for a given issue in JSON form.')
  .arguments('<key>')
  .usage('[options] r <key>')
  .option('-h, --host <host>', "The host name of the JIRA instance.")
  .option('--port <port>', "The port for the JIRA instance connection.")
  .option('-u, --username <username>', "The JIRA user's username.")
  .option('-p, --password <password>', "The JIRA user's password.")
  .option('-v, --verbose', "Log lots of extra details.")
  .option('-s, --silent', "Don't log anything unless there is an error.")
  .action(async function (key) {
    try {
      var jira = new Jira(configData(program))
      var issue = await jira.readIssue(key);
      console.dir(issue);
      console.log(JSON.stringify(issue.fields.issuelinks))
    } catch (e) {
      console.log(chalk.bold.red(e));
    }
  })
  .parse(process.argv);
