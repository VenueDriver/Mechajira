# config = require('./config/jira.yml')
util = require('util')
JiraClient = require('jira-connector')
jira = new JiraClient(
  host: 'hakkasan.atlassian.net' 
  basic_auth:
    username: 'mechajira',
    password: 'iryu1999!')
jira.search.search { jql: 'comment ~ ghost' }, (error, response) ->
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
