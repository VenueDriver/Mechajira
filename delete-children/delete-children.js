const config = require('../config/jira.json');
const util = require('util');
const jiraClient = require('jira-connector');
const fs = require('fs')

var jira = new jiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});

var issuekey = "WDEV-4156";

var getIssue = function(issuekey) {
  console.log(`Retrieving ${issuekey}...`);
  jira.issue.getIssue({
    "issueKey": issuekey
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(`Got ${issue}!`);
        findChildren(issue);
      }
  });
}

var findChildren = function(issuekey) {
  console.log(`Searching for children of ${issuekey}...`);
  jira.search({
    'jql': 'cf[11100]=${issuekey}'
  },
  function(error, childIssues) {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log(`Got ${childIssues}!`);
    }
  });
}

findChildren(issuekey);


/*
fs.readFile('./portfolio_test.csv', function (err, fileData) {
  parse(fileData, {columns: true, trim: true}, function(err, data) {
    extractColumns(data);
  });
});
*/
