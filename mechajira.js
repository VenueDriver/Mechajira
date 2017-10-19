#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

program
  .usage('[options] <command>')
  .command('create-list [options] [file]', 'Create a list of JIRA issues from a YAML command file.').alias('cl')
  .command('portfolio [options] [file]', 'Update JIRA issues from a JIRA Portfolio export CSV file.').alias('p')
  .command('find-children [options] [file]', 'Find all children of a parent issue.').alias('fc')
  .command('edit-children [options] [file]', 'Edit all children of a parent with fields set in a YAML file.').alias('ec')
  .parse(process.argv);
