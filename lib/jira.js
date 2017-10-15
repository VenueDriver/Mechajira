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
  jiraClient, commandData, summary, retryTimes, retryDelay, callback) {
  var tries = 0;

  var run = function() {
    // run async operation
    jiraClient.issue.createIssue(
      {
        "fields": {
          "project": {"key": commandData.project},
          "customfield_10008": commandData.epic,   // Epic within which to create task
          "summary": `${commandData.summary} ${summary}`,
          "description": `${commandData.description} ${summary}`,
          "issuetype": {"name": commandData.issuetype}
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
