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

////////////////////////////////
// GET ISSUE
////////////////////////////////
// jira.issue.getIssue({
//   issueKey: 'WET-19'
// }, function(error, issue) {
//   if (error) {
//    console.log(error);
//    return;
//   }
//   // console.log(issue);
//   console.log(issue.fields.summary);
// });

////////////////////////////////
// JIRA SEARCH
////////////////////////////////
// jira.search.search({
//   jql: 'comment ~ ghost'
// }, function(error, response) {
//      if (error) {
//        console.log(error);
//        return;
//      }
//      console.log('Issues count: ' + util.inspect(response.issues.length));
//      response.issues.forEach(function(issue) {
//        console.log('Issue ID: ' + util.inspect(issue.id));
//        console.log('Issue key: ' + util.inspect(issue.key));
//        console.log('Status: ' + issue.fields.status.name);
//        jira.issue.getComments({
//          issueKey: issue.key
//        }, function(error, response) {
//             console.log('Comment count: ', util.inspect(response.comments.length));
//             response.comments.forEach(function(comment) {
//               console.log('Comment ID: ' + util.inspect(comment.id));
//               console.log('Comment: ' + util.inspect(comment.body));
//             });
//           });
//       });
// });

////////////////////////////////
// TRANSITION > Start Progress
////////////////////////////////
// jira.issue.transitionIssue({
//   issueKey: 'STACK-36',
//   transition: '11'
// }, function(error, issue) {
//   if (error) {
//    console.log(error);
//    return;
//   }
//   // console.log(issue);
//   console.log(issue.fields);
// });

////////////////////////////////
// CLOSE ISSUE
////////////////////////////////
jira.issue.transitionIssue({
  issueKey: 'MEC-3',
  transition: '3'
}, function(error, issue) {
  if (error) {
   console.log(error);
   return;
  }
  // console.log(issue);
  console.log(issue);
});