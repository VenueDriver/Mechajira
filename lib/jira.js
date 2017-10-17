const jiraClient = require('jira-connector')

function Jira(configData) {
  this.jiraClient = this.getClient(configData)
  this.retryTimes = 10
  this.retryDelay = 500
}

Jira.prototype.getClient = function(configData) {
  return new jiraClient({
    host: configData['host'],
    basic_auth: {
      username: configData.username,
      password: configData.password
    }
  })
}

Jira.prototype.createIssue = function(issueData) {
  var self = this

  return new Promise(function(resolve, reject) {
    self.jiraClient.issue.createIssue(
      {
        'fields': {
          'project': {'key': issueData.project},
          'issuetype': {'name': issueData.issuetype},
          'summary': issueData.summary,
          'description': issueData.description,
          'customfield_10008': issueData.epic // Epic
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

Jira.prototype.editIssue = function(issueKey, issueData) {
  var self = this

  return new Promise(function(resolve, reject) {
    self.jiraClient.issue.editIssue(
      {
        'issueKey': issueKey,
        'issue': {
          'fields': issueData
        }
      },
      function(error, jiraIssue) {
        if (error) {
          reject(error)
        } else {
          // Return a fresh version of the issue, instead of the
          // "Issue Updated." string that the API returns.
          self.jiraClient.issue.getIssue({
              issueKey: issueKey
          }, function(error, updatedIssue) {
            if (error) {
              reject(error)
            } else {
              resolve(updatedIssue)
            }
          })
        }
      }
    )
  })
}

module.exports = Jira
