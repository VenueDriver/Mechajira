const util = require('util')
const fs = require('fs')
const jiraClient = require('jira-connector')
const parse = require('csv-parse')
const chalk = require('chalk')

const Jira = require('./jira')

exports.portfolio = function (configData, portfolioExportFile='portfolio.csv') {
  if(!configData['silent']) {
    console.log(chalk.bold.cyan('Updating issues from JIRA Portfolio export') +
      chalk.bold.cyan(portfolioExportFile))
  }

  // Get a JIRA API connection.
  var jira = new Jira(configData)

  // Read the Portfolio data from the CSV file.
  fs.readFile(portfolioExportFile, function (err, fileData) {
    parse(fileData, {columns: true, trim: true}, async function(err, data) {
      for (var i = 0, length = data.length; i < length; i++) {
        const row = data[i]
        const issueKey = row['Issue key']

        // Format the scheduled end date for the JIRA API, if there is one.
        const scheduledEnd = row['Scheduled end']
        if (0 === scheduledEnd.length) {
          console.log("Empty scheduled end date.  Skipping.")
          continue
        }
        var dueDate = new Date(row['Scheduled end'])
        var formattedDueDate =
          `${dueDate.getFullYear()}-${dueDate.getMonth()}-${dueDate.getDate()}`
        console.log("Setting due date on " + row['Issue key'] + ' to ' +
          formattedDueDate)

        // Configuration for the keys that editIssue will set.
        var issueData = {
          'description': 'Updated by Mechajira.',
          'duedate': formattedDueDate
        }
        try {
          // Update the issue.
          var jiraIssue = await jira.editIssue(issueKey, issueData)

          if(!configData['silent']) {
            console.log(chalk.bold.cyan(`${issueKey}`) + ' due date ' +
              chalk.bold.green(`updated to ${jiraIssue['fields'].duedate}`))
          }
        } catch (error) {
          console.log(chalk.bold.red(error))
        }
      }
    });
  });

}
