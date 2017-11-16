const jiraClient = require('jira-connector')

class Jira {

  constructor(configData) {
    this.configData = configData
    this.jiraClient = this.getClient(configData)
    this.retryTimes = 10
    this.retryDelay = 500
  }

  createIssue(issueFields) {
    var self = this

    return new Promise(function(resolve, reject) {

      // Copy and massage the issue fields.
      var massagedFields = Object.assign({}, issueFields)
      if(massagedFields.project) {
        massagedFields.project = {'key': issueFields.project}
      }
      if(massagedFields.parent) {
        massagedFields.parent = {'key': issueFields.parent}
      }
      if(massagedFields.type) {
        massagedFields.issuetype = {'name': issueFields.type}
        delete massagedFields.type
      }
      if(massagedFields.epic) {
        massagedFields.customfield_10008 = issueFields.epic
        delete massagedFields.epic
      }
      if(massagedFields.name) {
        massagedFields.customfield_10009 = issueFields.name
        delete massagedFields.name
      }

      if(self.configData['verbose']) {
        console.log('Data for API:')
        console.dir(massagedFields)
      }

      // Send the new issue data to the JIRA API.
      self.jiraClient.issue.createIssue({'fields': massagedFields},
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

  editIssue(issueKey, issueData) {
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

  findDescendents(issueKey) {
    var self = this
    var descendentKeys = [];

    return new Promise(function(resolve, reject) {
      self.jiraClient.search.search({
        'jql': "cf[10008]=" + `${issueKey}`
        },
        function(error, descendents) {
          if (error) {
            reject(error)
          } else {
            descendents.issues.forEach(function(descendent) {
              //console.log(child.key)
              descendentKeys.push(descendent.key);
            })
            resolve(descendentKeys);
          }
        })
    })
  }

  getClient(configData) {
    return new jiraClient({
      host: configData['host'],
      basic_auth: {
        username: configData.username,
        password: configData.password
      }
    })
  }

  linkIssue(linkType, fromIssueKey, toIssueKey) {
    var self = this

    return new Promise(function(resolve, reject) {
      self.jiraClient.issueLink.createIssueLink(
        {
          "issueLink": {
            "type": {"name": linkType},
            "inwardIssue": {"key": fromIssueKey},
            "outwardIssue": {"key": toIssueKey}
          }
        },
        function(error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
    })
  }

  readIssue(issueKey) {
    var self = this

    return new Promise(function(resolve, reject) {
      return self.jiraClient.issue.getIssue({
          issueKey: issueKey
      }, function(error, issue) {
        if (error) {
          reject(error)
        } else {
          resolve(issue)
        }
      })
    })
  }

  search(jqlquery) {
    var self = this

    return new Promise(function(resolve, reject) {
      self.jiraClient.search.search(
        {"jql": jqlquery},
      function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
    })
  }

}

module.exports = Jira
