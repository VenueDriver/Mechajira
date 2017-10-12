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
  console.log(Object.keys(issuesAndDates)[10]);
  console.log(Object.values(issuesAndDates)[10]);
  //updateTasks(issuesAndDates);
}

var updateTasks = function(issuesAndDates) {
  var numberIssues = Object.keys(issuesAndDates).length;
  for (var i = 0; i < numberIssues; i++) {
    console.log(`Updating ${Object.keys(issuesAndDates)[i]} Dudedate to ${Object.values(issuesAndDates)[i]}...`);
    /*
    jira.issue.editIssue(
      {
        "update": {
          "parent": {"key": issueKey},
          "duedate": {"key": project},
        }
      },
      function(error, issue) {
        if (error) {
          console.log(error);
          return;
        } else {
          var techQaMobileFriendlyKey = issue.key;
          issueKeys.techQaMobileFriendlyKey = techQaMobileFriendlyKey;
        }
      });
      */
  };
}

fs.readFile('./portfolio.csv', function (err, fileData) {
  parse(fileData, {columns: true, trim: true}, function(err, data) {
    extractColumns(data);
  });
});
