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

// this whole block of code encasulates the retry logic,
// each capsule then gets tossed on the heap later by the foreach loop
var tryToCreateSubtasks = function(config, task, retryTimes, retryDelay, callback) {
  var tries = 0;

  var run = function() {
    // run async operation
    jira.issue.createIssue(
      {
        "fields": {
          "parent": {"key": task},
          "project": {"key": config.project},
          "summary": "Make sure this site has proper meta title and description tags.",
          "description": "",
          "issuetype": {"name": "Sub-task"},
          //  "assignee": {"name": "jhand"},
          //  "labels": ["the-bytery", "clubs"]
        }
      },
      function(error, issue) {
        ++tries;
        if (error) {
          if (tries >= retryTimes) {
            // if it fails too many times, just send the error out
            console.log(error);
          } else {
            // try again after a delay
            setTimeout(run, retryDelay);
          }
        } else {
          // success, send the data out
          callback(error, issue);
        }
      });
    jira.issue.createIssue(
      {
        "fields": {
          "parent": {"key": task},
          "project": {"key": config.project},
          "summary": "Make sure this site has proper facebook og tags in place, especially an og:image tag.",
          "description": "",
          "issuetype": {"name": "Sub-task"},
          //  "assignee": {"name": "jhand"},
          //  "labels": ["the-bytery", "clubs"]
        }
      },
      function(error, issue) {
        ++tries;
        if (error) {
          if (tries >= retryTimes) {
            // if it fails too many times, just send the error out
            console.log(error);
          } else {
            // try again after a delay
            setTimeout(run, retryDelay);
          }
        } else {
          // success, send the data out
          callback(error, issue);
        }
      });
    jira.issue.createIssue(
      {
        "fields": {
          "parent": {"key": task},
          "project": {"key": config.project},
          "summary": "Make sure this site has proper twitter card tags in place.",
          "description": "",
          "issuetype": {"name": "Sub-task"},
          //  "assignee": {"name": "jhand"},
          //  "labels": ["the-bytery", "clubs"]
        }
      },
      function(error, issue) {
        ++tries;
        if (error) {
          if (tries >= retryTimes) {
            // if it fails too many times, just send the error out
            console.log(error);
          } else {
            // try again after a delay
            setTimeout(run, retryDelay);
          }
        } else {
          // success, send the data out
          callback(error, issue);
        }
      });
    }
    // start our first request
    run();
}

// this is the foreach loop that iterates over the list of sites in the config file
var createAllSubtasks = function(config) {
  config.tasks.forEach(function(task) {
    console.log(`Creating sub-tasks for ${task}...`);
    tryToCreateSubtasks(config, task, 10, 500, function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(`Subtasks ${issue.key} created for ${task}`);
      }
    })
  })
}

try {
  var config = yaml.safeLoad(fs.readFileSync('social-qa-config.yml', 'utf8'));
  console.log("Preparing to create subtasks in the following tasks: " + config.tasks.join(", ") + "...\n");
  createAllSubtasks(config);
} catch (e) {
  console.log(e);
}
