#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

// Returns a hash of configuration values.
const configData = require('./lib/config').configData;
// Performs the API call.
const Jira = require('./lib/jira');
// Performs the create-list operation.
const EditChildren = require('./lib/edit-children');

program
  .description('Edit all children of a parent with fields set in a YAML command file.')
  .arguments('<key> <file>')
  .usage('[options] ec <key> <file>')
  .option('-h, --host <host>', "The host name of the JIRA instance.")
  .option('--port <port>', "The port for the JIRA instance connection.")
  .option('-u, --username <username>', "The JIRA user's username.")
  .option('-p, --password <password>', "The JIRA user's password.")
  .option('-v, --verbose', "Log lots of extra details.")
  .option('-s, --silent', "Don't log anything unless there is an error.")
  .action(function (key, file) {
    try {
      var editChildren = new EditChildren(configData(program))
      editChildren.process(file);
    } catch (e) {
      console.log(chalk.bold.red(e));
    }
  })
  .parse(process.argv);
