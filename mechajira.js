var config = require('./config/jira.json');
var util = require('util');

JiraApi = require('jira').JiraApi;
var jira = new JiraApi('https',
  config.host,
  config.port,
  config.user,
  config.password,
  '2');

fields = ["summary", "description", "comments", "status"]
jira.searchJira('comment ~ mechajira', fields, function(error, response) {
  console.log('Response: ' + util.inspect(response, { showHidden: true, depth: null }));
  console.log('Issues count: ' + util.inspect(response.issues.length));

  response.issues.forEach(function(issue) {
    console.log('Issue key: ' + util.inspect(issue.key));
    console.log('Status: ' + issue.fields.status.name);
    console.log('Issue comments: ' + util.inspect(issue.comments));
  });
});
