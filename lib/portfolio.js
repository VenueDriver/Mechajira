const util = require('util')
const fs = require('fs')
const jiraClient = require('jira-connector')
const parse = require('csv-parse')
const chalk = require('chalk')

const Jira = require('./jira')

exports.updateIssues = function (configData, portfolioExportFile = 'portfolio.csv') {
  if(!configData['silent']) {
    console.log(chalk.bold.cyan('Updating issues from JIRA Portfolio export') +
      chalk.bold.cyan(portfolioExportFile))
  }

  // Get a JIRA API connection.
  var jira = new Jira(configData)

  // Read the Portfolio data from the CSV file.
  fs.readFile('./portfolio_test.csv', function (err, fileData) {
    parse(fileData, {columns: true, trim: true}, function(err, data) {
      jira.updateIssue(issue)
    });
  });

}
