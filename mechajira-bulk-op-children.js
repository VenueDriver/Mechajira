#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

// Returns a hash of configuration values.
const configData = require('./lib/config').configData;
// Performs the API call.
const Jira = require('./lib/jira');
// Performs the create-list operation.
const BulkOpChildren = require('./lib/bulk-op-children');

program
  .description('Perform bulk operation on all children of a parent.')
  .arguments('<key> <operation> [fields...]')
  .usage('[options] boc <key> <operation> [fields]')
  .option('-h, --host <host>', "The host name of the JIRA instance.")
  .option('--port <port>', "The port for the JIRA instance connection.")
  .option('-u, --username <username>', "The JIRA user's username.")
  .option('-p, --password <password>', "The JIRA user's password.")
  .option('-v, --verbose', "Log lots of extra details.")
  .option('-s, --silent', "Don't log anything unless there is an error.")
  .option('-d, --del', "Delete all children under the parent (including the parent).")
  .option('-c, --close', "Close all children under the parent (including the parent).")
  .option('-e, --edit', "Edit all children under the parent with the following fields/values.")
  .option('-a, --assignee <assignee>', "New assignee for tasks.")
  .option('-dd, --duedate <duedate>', "New duedate for tasks.")
  .action(function (key, op, fields) {
    try {
      var bulkOpChildren = new BulkOpChildren(configData(program));
      if (fields) {
        bulkOpChildren.process(key, op, fields);
      } else {
        console.log("Performing bulk operation...")
        bulkOpChildren.process(key, op);
      }
    } catch (e) {
      console.log(chalk.bold.red(e));
    }
  })
  .parse(process.argv);
