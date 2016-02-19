var config = require('./config/jira.json');
var util = require('util');

var JiraClient = require('jira-connector');
var jira = new JiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});

jira.search.search({jql: 'comment ~ mechajira'}, function(error, response) {
  console.log('Issues count: ' + util.inspect(response.issues.length));

  response.issues.forEach(function(issue) {
    console.log('Issue ID: ' + util.inspect(issue.id));
    console.log('Issue key: ' + util.inspect(issue.key));
    console.log('Status: ' + issue.fields.status.name);

    jira.issue.getComments({issueKey: issue.key}, function(error, response) {
      console.log('Comment count: ', util.inspect(response.comments.length));

      response.comments.forEach(function(comment){
        console.log('Comment ID: ' + util.inspect(comment.id));
        console.log('Comment: ' + util.inspect(comment.body));
      });
    });
  });
});
