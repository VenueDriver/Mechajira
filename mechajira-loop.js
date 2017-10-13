#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

// Returns a hash of configuration values.
const config_data = require('./lib/config').config_data;
// Performs the loop operation.
const loop = require('./lib/loop').loop;

program
  .arguments('<file>')
  .usage('[options] loop <file>')
  .option('-h, --host <host>', "The host name of the JIRA instance.")
  .option('--port <port>', "The port for the JIRA instance connection.")
  .option('-u, --username <username>', "The JIRA user's username.")
  .option('-p, --password <password>', "The JIRA user's password.")
  .option('-v, --verbose', "Log lots of extra details.")
  .action(function (file) {
    try {
      loop(config_data(program), file);
    } catch (e) {
      console.log(chalk.bold.red(e));
    }
  })
  .parse(process.argv);
