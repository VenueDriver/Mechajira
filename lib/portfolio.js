const util = require('util')
const fs = require('fs')
const parse = require('csv-parse')
const chalk = require('chalk')

const Jira = require('./jira')

function Portfolio(configData) {
  this.configData = configData
}

Portfolio.prototype.process =
  async function (portfolioExportFile='portfolio.csv') {

  if(!this.configData['silent']) {
    console.log('Updating issues from JIRA Portfolio export ' +
      chalk.bold.cyan(portfolioExportFile))
  }

  // Get a JIRA API connection.
  var jira = new Jira(this.configData)

  // Read the Portfolio data from the CSV file.
  var fileRows = []
  try {
    fileRows = await getFileRows(portfolioExportFile)
  } catch (error) {
    console.log(chalk.bold.red(error), err.stack)
  }

  for (var i = 0, length = fileRows.length; i < length; i++) {
    const row = fileRows[i]
    const issueKey = row['Issue key']

    // Format the scheduled end date for the JIRA API, if there is one.
    const scheduledEnd = row['Scheduled end']
    if (!scheduledEnd || 0 === scheduledEnd.length) {
      console.log('Skipping issue ' + chalk.bold.cyan(issueKey) +
       ', with no scheduled end date.')
      continue
    }
    var dueDate = new Date(row['Scheduled end'])
    var formattedDueDate =
      `${dueDate.getFullYear()}-${dueDate.getMonth()+1}-${dueDate.getDate()}`
    if(!this.configData['silent']) {
      console.log("Setting due date on " + chalk.bold.cyan(issueKey) +
        ' to ' + chalk.bold.cyan(row['Scheduled end']) + '...')
    }

    // Configuration for the keys that editIssue will set.
    var issueData = {
      'duedate': formattedDueDate
    }
    try {
      // Update the issue.
      var jiraIssue = await jira.editIssue(issueKey, issueData)

      if(!this.configData['silent']) {
        console.log(chalk.bold.cyan(`${issueKey}`) + ' due date ' +
          chalk.bold.green(`updated to ${jiraIssue['fields'].duedate}`) + '.')
      }
    } catch (error) {
      console.log(chalk.bold.red(error))
    }
  }
}

// Get rows of CSV data from the JIRA Portfolio export file.
function getFileRows(portfolioExportFile) {
  return new Promise(function(resolve, reject) {
    fs.readFile(portfolioExportFile, function (err, fileData) {
      parse(fileData, {columns: true, trim: true}, function(error, data) {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  })
}

module.exports = Portfolio
