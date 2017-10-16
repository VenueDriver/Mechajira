var jiraClient = require('jira-connector');

exports.jiraClientFromConfig = function (configData) {
  return new jiraClient({
    host: configData['host'],
    basic_auth: {
      username: configData['username'],
      password: configData['password']
    }
  });
}

// this whole block of code encasulates the retry logic,
// each capsule then gets tossed on the heap later by the foreach loop
exports.createIssue = function(
  jiraClient, issue, retryTimes=10, retryDelay=500, callback) {
  var tries = 0;

  var run = function() {
    jiraClient.issue.createIssue(
      {
        "fields": {
          "project": {"key": issue.project},
          "customfield_10008": issue.epic, // Epic within which to create issue
          "summary": `${issue.summary} ${issue.summary}`,
          "description": `${issue.description} ${summary}`,
          "issuetype": {"name": issue.issuetype}
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
