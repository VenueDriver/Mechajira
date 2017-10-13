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

var issue = "MECTEST-40";
var duedate = "26-Oct-17";

var updateTask = function(issue, duedate) {
  console.log(`Updating ${issue} Dudedate to ${duedate}...`);
  jira.issue.editIssue({
    "issue": {"issueKey": "MECTEST-40"},
    "fields": {"duedate": duedate}
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(`Update for ${issue} complete!`);
      }
  });
}

updateTask(issue, duedate);

/*
fs.readFile('./portfolio_test.csv', function (err, fileData) {
  parse(fileData, {columns: true, trim: true}, function(err, data) {
    extractColumns(data);
  });
});
*/
