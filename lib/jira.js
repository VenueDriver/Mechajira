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
