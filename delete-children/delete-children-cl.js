const util = require('util');
const jiraClient = require('jira-connector');
const Jira = require('../lib/jira')

var issuekey = "MECTEST-1";

exports.deleteChildren = async function(configData, issuekey) {

  // Get a JIRA API connection.
  var jira = new Jira(configData)

  // console.log(`Searching for children of ${issuekey}...`);
  // find all child issues of a specific epic
  jira.search.search({
    'jql': "cf[10008]=" + `${issuekey}`
  },
  function(error, children) {
    if (error) {
      console.log(error);
      return;
    } else {
      children.issues.forEach(function(child) {
        console.log(child.key);
        jira.issue.deleteIssue({
          "issueKey": child.key
        },
        function(error, result) {
          if (error) {
            console.log(error);
            return;
          } else {
            console.log(`Deleted ${child.key}`);
          }
        })
      })
    }
  })
}

deleteChildren(issuekey);
