const util = require('util')
const fs = require('fs')
const jiraClient = require('jira-connector')
const yaml = require('js-yaml')
const chalk = require('chalk')

const Jira = require('./jira')

exports.findChildren = async function (configData, parent) {
  // Get a JIRA API connection.
  var jira = new Jira(configData)

  // Find children of parent
  jira.search({
    'jql': "cf[10008]=" + `${parent}`
  },
  function(error, children) {
    if (error) {
      console.log(error);
      return;
    } else {
      var children = this.children
      children.issues.forEach(function(child) {
        console.log(child.key);
      })
    }
  })
}