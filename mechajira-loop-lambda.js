var config = require('./config/jira.json');

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

var bombsAway = function(config) {
  config.sites.forEach(function(site) {
    console.log(`Creating issue for ${site}...`);
    jira.issue.createIssue(
      {
        "fields": {
           "project": {"key": config.project},
           "customfield_10008": config.epic,   // Epic within which to create task
           "summary": `${config.summary} ${site}`,
           "description": config.description,
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

var readConfig = function() {
  try {
    var config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log("Preparing to create cloned Jira issues for : " + config.sites.join(", ") + "...\n");
    bombsAway(config);
  } catch (e) {
    console.log(e);
  }
}

exports.handler = function(event, context) {
  readConfig();
}
