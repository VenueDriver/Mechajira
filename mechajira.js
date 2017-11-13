#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

program
  .usage('[options] <command>')
  .command('create-list [options] <file>', 'Create a list of JIRA issues from a YAML command file.').alias('cl')
  .command('portfolio [options] <file>', 'Update JIRA issues from a JIRA Portfolio export CSV file.').alias('p')
  .command('read-issue [options] <key>', 'Print the data for a given issue in JSON form.').alias('r')
  .command('find-children [options] <key>', 'Find all children of a parent issue.').alias('fc')
  .command('edit-children [options] <key> <file>', 'Edit all children of a parent with fields set in a YAML command file.').alias('ec')
  .parse(process.argv);
