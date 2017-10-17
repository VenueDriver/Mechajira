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
  })
}

// this whole block of code encasulates the retry logic,
// each capsule then gets tossed on the heap later by the foreach loop
Jira.prototype.createIssue = function(issueData, callback) {
  var self = this

  return new Promise(function(resolve, reject) {
    self.jiraClient.issue.createIssue(
      {
        "fields": {
          "project": {'key': issueData.project},
          "issuetype": {'name': issueData.issuetype},
          "summary": issueData.summary,
          "description": issueData.description,
          "customfield_10008": issueData.epic // Epic
        }
      },
      function(error, jiraIssue) {
        if (error) {
          reject(error)
        } else {
          resolve(jiraIssue)
        }
      }
    )
  })
}

module.exports = Jira
