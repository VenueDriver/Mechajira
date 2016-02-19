config = require('./config/jira.json')
util = require('util')
JiraClient = require('jira-connector')
jira = new JiraClient(
  host: config.host
  basic_auth:
    username: config.username
    password: config.password)
jira.search.search { jql: 'comment ~ mechajira' }, (error, response) ->
  console.log 'Issues count: ' + util.inspect(response.issues.length)
  response.issues.forEach (issue) ->
    console.log 'Issue ID: ' + util.inspect(issue.id)
    console.log 'Issue key: ' + util.inspect(issue.key)
    console.log 'Status: ' + issue.fields.status.name
    jira.issue.getComments { issueKey: issue.key }, (error, response) ->
      console.log 'Comment count: ', util.inspect(response.comments.length)
      response.comments.forEach (comment) ->
        console.log 'Comment ID: ' + util.inspect(comment.id)
        console.log 'Comment: ' + util.inspect(comment.body)
        return
      return
    return
  return
