var config = require('./config/jira.json');
var util = require('util');
var JiraClient = require('jira-connector');

var jira = new JiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});

var project = 'MEC';
var epic = 'MEC-13';

////////////////////////////////
// CREATE ISSUES
////////////////////////////////
jira.issue.createIssue({
  "fields": {
       "project":
       {
          "key": project
       },
       "summary": "Ava task inside Test Epic",
       "description": "Adding task to Epic 'Test Bombing Epic'",
       "issuetype": {
          "name": "Task"
       },
       "customfield_10008": epic    // Epic within which to create task
   }
}, function(error, issue) {
  if (error) {
   console.log(error);
   return;
  }
  console.log(issue);
});




////////////////////////////////
// CREATE EPIC
////////////////////////////////
// jira.issue.createIssue({
//   "fields": {
//        "project":
//        {
//           "key": "MEC"
//        },
//        "summary": "Test Epic",
//        "description": "Creating test epic for test bulk task bombing runs...",
//        "issuetype": {
//           "name": "Epic"
//        },
//        "customfield_10009": "Test Bombing Epic"    // Epic name is required
//    }
// }, function(error, issue) {
//   if (error) {
//    console.log(error);
//    return;
//   }
//   console.log(issue);
// });
