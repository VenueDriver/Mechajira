#!/usr/bin/env node --harmony
var program = require('commander');
var chalk = require('chalk');

program
  .usage('[options] <command>')
  .command('loop [options] [file]', 'Create a list of JIRA issues from a YAML command file.')
  .parse(process.argv);
