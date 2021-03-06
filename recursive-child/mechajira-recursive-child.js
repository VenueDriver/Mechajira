var config = require('../config/jira.json');

var util = require('util');
var fs = require('fs');
var jiraClient = require('jira-connector');
var yaml = require('js-yaml');

var jira = new jiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});
// var jira = new jiraClient({      // Use this block with environment variables
//   host: HOST,
//   basic_auth: {
//     username: USERNAME,
//     password: PASSWORD
//   }
// });

var getIssue = function(config) {
  console.log(`Fetching data for ${config.issue}`);
}

var parseIssue = function(config) {
  
}

/*
var bombsAway = function(config) {
  config.issue.forEach(function(site) {
    console.log(`Creating issue for ${site}...`);
    jira.issue.createIssue(
      {
        "fields": {
           "project": {"key": config.project},
           "customfield_10008": config.epic,   // Epic within which to create task
           "summary": `${config.summary} ${site}`,
           "description": `${config.description} ${site}`,
           "issuetype": {"name": config.issuetype}
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

*/
try {
  var config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
  getIssue(config);
} catch (e) {
  console.log(e);
}
