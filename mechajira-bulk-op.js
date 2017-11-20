#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

// Returns a hash of configuration values.
const configData = require('./lib/config').configData;
// Performs the API call.
const Jira = require('./lib/jira');
// Performs the create-list operation.
const BulkOp = require('./lib/bulk-op');

program
  .description('Perform bulk operation on all descendents of a ancestor issue.')
  .arguments('<key> <operation> [options...]')
  .usage('[options] bo <key> <operation> [options...]')
  .option('-h, --host <host>', "The host name of the JIRA instance.")
  .option('--port <port>', "The port for the JIRA instance connection.")
  .option('-u, --username <username>', "The JIRA user's username.")
  .option('-p, --password <password>', "The JIRA user's password.")
  .option('-v, --verbose', "Log lots of extra details.")
  .option('-s, --silent', "Don't log anything unless there is an error.")
  .option('-d, --del', "Delete all descendents under the ancestor (including the ancestor).")
  .option('-c, --close', "Close all descendents under the ancestor (including the ancestor).")
  .option('-t, --trans <transID>', "Transition all descendents under the ancestor (including the ancestor).")
  .option('-gt, --gettrans', "Get a list of transitions available for a given issue.")
  .option('-e, --edit <fields...>', "Edit all descendents under the ancestor with the following fields/values.")
  .option('-a, --assignee <assignee>', "New assignee for tasks.")
  .option('-dd, --duedate <duedate>', "New duedate for tasks.")
  .action(function (key, op, options) {
    try {
      var bulkOp = new BulkOp(configData(program));
      console.log('Key: ' + key);
      console.log('Op: ' + op);
      console.log('Options: ' + options);
      if (options) {
        bulkOp.process(key, op, options);
      } else {
        console.log("Performing bulk operation...")
        bulkOp.process(key, op);
      }
    } catch (e) {
      console.log(chalk.bold.red(e));
    }
  })
  .parse(process.argv);
