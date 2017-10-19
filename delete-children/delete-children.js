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

var issuekey = "MECTEST-1";

var deleteChildren = function(issuekey) {
  console.log(`Searching for children of ${issuekey}...`);
  jira.search.search({
    'jql': "cf[10008]=" + `${issuekey}`
  },
  function(error, children) {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log(children.issues.length);
      children.issues.forEach(function(child) {
        console.log(child.key);
        // jira.issue.deleteIssue({
        //   "issueKey": child.key
        // },
        // function(error, result) {
        //   if (error) {
        //     console.log(error);
        //     return;
        //   } else {
        //     console.log(`Deleted ${child.key}`);
        //   }
      })
    }
  })
}

deleteChildren(issuekey);
