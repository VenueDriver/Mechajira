#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

// Returns a hash of configuration values.
const configData = require('./lib/config').configData;
// Performs the create-list operation.
const CreateList = require('./lib/create-list');

program
  .description('Create a list of JIRA issues from a YAML command file.')
  .arguments('<file>')
  .usage('[options] loop <file>')
  .option('-h, --host <host>', "The host name of the JIRA instance.")
  .option('--port <port>', "The port for the JIRA instance connection.")
  .option('-u, --username <username>', "The JIRA user's username.")
  .option('-p, --password <password>', "The JIRA user's password.")
  .option('-v, --verbose', "Log lots of extra details.")
  .option('-s, --silent', "Don't log anything unless there is an error.")
  .action(function (file) {
    try {
      var createList = new CreateList(configData(program))
      createList.process(file);
    } catch (e) {
      console.log(chalk.bold.red(e));
    }
  })
  .parse(process.argv);
