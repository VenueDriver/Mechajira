const config = require('../config/jira.json');
const util = require('util');
const jiraClient = require('jira-connector');
const parse = require('csv-parse')
const fs = require('fs')

var jira = new jiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});

var extractColumns = function(data) {
  var issuesAndDates = new Object();
  data.forEach(function(issue) {
    issuesAndDates[issue['Issue key']] = issue['Scheduled end'];
  });
  updateTasks(issuesAndDates);
}

var updateTasks = function(issuesAndDates) {
  var dates = Object.keys(issuesAndDates).map(function(key) {
    return issuesAndDates[key];
  });
  var numberIssues = Object.keys(issuesAndDates).length;
  for (var i = 0; i < numberIssues; i++) {
    var issue = Object.keys(issuesAndDates)[i];
    var duedate = dates[i];
    console.log(`Updating ${issue} Dudedate to ${duedate}...`);
    jira.issue.editIssue({
      "key": issue,
      "fields": {
        "duedate": {"key": duedate}
      }
    }, function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(`Update for ${issue} complete!`);
      }
    });
  };
}

fs.readFile('./portfolio_test.csv', function (err, fileData) {
  parse(fileData, {columns: true, trim: true}, function(err, data) {
    extractColumns(data);
  });
});
