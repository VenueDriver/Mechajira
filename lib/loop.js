var util = require('util');
var fs = require('fs');
var jiraClient = require('jira-connector');
var yaml = require('js-yaml');

var config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

var jira = new jiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});

// this whole block of code encasulates the retry logic,
// each capsule then gets tossed on the heap later by the foreach loop
var tryToCreateIssue = function(config, site, retryTimes, retryDelay, callback) {
  var tries = 0;

  var run = function() {
    // run async operation
    jira.issue.createIssue(
      {
        "fields": {
          "project": {"key": config.project},
          "customfield_10008": config.epic,   // Epic within which to create task
          "summary": `${config.summary} ${site}`,
          "description": `${config.description} ${site}`,
          "issuetype": {"name": config.issuetype}
           //"assignee": {"name": "fgalan"},
           //"labels": ["the-bytery", "clubs"]
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
      })
    }
    // start our first request
    run();
}

// this is the foreach loop that iterates over the list of sites in the config file
var createAllIssues = function(config) {
  config.sites.forEach(function(site) {
    console.log(`Creating issue for ${site}...`);
    tryToCreateIssue(config, site, 10, 500, function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(`${issue.key} created for ${site}`);
      }
    })
  })
}

exports.loop = function (file = 'config.yml') {
  var command_data = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  console.log("Preparing to create cloned Jira issues for : " +
    command_data.sites.join(", ") + "...\n");
  createAllIssues(command_data);
}
