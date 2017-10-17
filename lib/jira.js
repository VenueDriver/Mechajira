const jiraClient = require('jira-connector');

function Jira(configData) {
  this.jiraClient = this.getClient(configData)
  this.retryTimes = 10
  this.retryDelay = 500
}

Jira.prototype.getClient = function(configData) {
  return new jiraClient({
    host: configData['host'],
    basic_auth: {
      username: configData['username'],
      password: configData['password']
    }
  });;
}

// this whole block of code encasulates the retry logic,
// each capsule then gets tossed on the heap later by the foreach loop
Jira.prototype.createIssue = function(issue_data, callback) {
  var self = this;
  var tries = 0;

  var run = function() {
    self.jiraClient.issue.createIssue(
      {
        "fields": {
          "project": {'key': issue_data.project},
          "issuetype": {'name': issue_data.issuetype},
          "summary": issue_data.summary,
          "description": issue_data.description,
          "customfield_10008": issue_data.epic // Epic
        }
      },
      function(error, jira_issue) {
        ++tries;
        if (error) {
          if (tries >= this.retryTimes) {
            // if it fails too many times, just send the error out
            console.log(error);
          } else {
            setTimeout(run, this.retryDelay);
          }
        } else {
          // success, send the data out
          callback(error, jira_issue);
        }
      })
    }
    // start our first request
    run();
}

module.exports = Jira;
