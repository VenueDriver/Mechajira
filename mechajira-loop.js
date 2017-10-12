#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');
const loop = require('./lib/loop').loop;

program
  .arguments('<file>')
  .usage('[options] loop <file>')
  .option('-h, --host <host>', "The host name of the JIRA instance.")
  .option('-u, --username <username>', "The JIRA user's username.")
  .option('-p, --password <password>', "The JIRA user's password.")
  .action(function (file) {
    try {
      console.log('Running loop on ' + chalk.bold.cyan(file));
      console.log(loop(file))
    } catch (e) {
      console.log(chalk.bold.red(e));
    }
  })
  .parse(process.argv);
