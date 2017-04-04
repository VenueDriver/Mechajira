var config = require('./config/jira.json');

var util = require('util');
var fs = require('fs');
var async = require('async');
var jiraClient = require('jira-connector');
var yaml = require('js-yaml');

var jira = new jiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});

try {
  var yaml = yaml.safeLoad(fs.readFileSync('sites.yml', 'utf8'));
  var sites = yaml.sites;
  console.log("Preparing to create cloned Jira issues for : " + sites.join(", ") + "...\n");
} catch (e) {
  console.log(e);
}

var project = 'MEC';
var epic = 'MEC-90';
var issueKeys = {};

// DEFINE INITIAL TASK BOMB
var bombsAway = function(sites, project, epic) {
  sites.forEach(function(site) {
    console.log(`Creating issue for ${site}...`);
    jira.issue.createIssue(
      {
        "fields": {
           "project": {"key": project},
           "customfield_10008": epic,   // Epic within which to create task
           "summary": `Fix/Implement SSL on ${site}`,
           "description": "SSL is either broken or not implemented on this website. Please make this site fully SSL compliant.",
           "issuetype": {"name": "Task"}
          //  "assignee": {"name": "fgalan"},
          //  "labels": ["the-bytery", "clubs"]
         }
      },
      function(error, issue) {
        if (error) {
          console.log(error);
          return;
        } else {
          console.log(`${issue.key} created for ${site}`);
        }
      })
  })
}


// CALL INITIAL TASK BOMB
bombsAway(sites, project, epic);


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
