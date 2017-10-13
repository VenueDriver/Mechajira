var util = require('util');
var fs = require('fs');
var jiraClient = require('jira-connector');
var yaml = require('js-yaml');
var chalk = require('chalk');

// this whole block of code encasulates the retry logic,
// each capsule then gets tossed on the heap later by the foreach loop
var tryToCreateIssue = function(
  jira, command_data, summary, retryTimes, retryDelay, callback) {
  var tries = 0;

  var run = function() {
    // run async operation
    jira.issue.createIssue(
      {
        "fields": {
          "project": {"key": command_data.project},
          "customfield_10008": command_data.epic,   // Epic within which to create task
          "summary": `${command_data.summary} ${summary}`,
          "description": `${command_data.description} ${summary}`,
          "issuetype": {"name": command_data.issuetype}
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

// Iterate over the list of sites in the config file.
var createAllIssues = function(jira, command_data) {
  command_data.summaries.forEach(function(summary) {
    console.log(`Creating issue for ${summary}...`);
    tryToCreateIssue(jira, command_data, summary, 10, 500, function(error, issue) {
      if (error) {
        console.log(halk.bold.red(error));
        return;
      } else {
        console.log(chalk.bold.green(`${issue.key} created for ${summary}`));
      }
    })
  })
}

exports.loop = function (config_data, command_file = 'command.yml') {
  if(config_data['verbose']) {
    console.log('Running loop on ' + chalk.bold.cyan(command_file));
  }
  // Read the command data from the YAML file.
  const command_data = yaml.safeLoad(fs.readFileSync(command_file, 'utf8'));
  // Get a JIRA API connection.
  var jira = new jiraClient({
    host: config_data['host'],
    basic_auth: {
      username: config_data['username'],
      password: config_data['password']
    }
  });

  createAllIssues(jira, command_data);
}
