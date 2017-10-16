var util = require('util');
var fs = require('fs');
var jiraClient = require('jira-connector');
var yaml = require('js-yaml');
var chalk = require('chalk');

const jiraClientFromConfig = require('./jira').jiraClientFromConfig;

// this whole block of code encasulates the retry logic,
// each capsule then gets tossed on the heap later by the foreach loop
var tryToCreateIssue = function(
  jira, commandData, summary, retryTimes, retryDelay, callback) {
  var tries = 0;

  var run = function() {
    // run async operation
    jira.issue.createIssue(
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

// Iterate over the list of sites in the config file.
var createAllIssues = function(configData, jira, commandData) {
  commandData.summaries.forEach(function(summary) {
    console.log('Creating issue for ' + chalk.bold.cyan(`${summary}...`));
    tryToCreateIssue(jira, commandData, summary, 10, 500, function(error, issue) {
      if (error) {
        console.log(halk.bold.red(error));
        return;
      } else {
        if(configData['verbose']) {
          console.log(chalk.bold.green(`${issue.key} created`) + ' for ' +
            chalk.bold.cyan(`${summary}`));
        }
      }
    })
  })
}

exports.createList = function (configData, commandFile = 'command.yml') {
  console.log(chalk.bold.cyan('Creating List') +
    ' from command file ' + chalk.bold.cyan(commandFile));
  // Read the command data from the YAML file.
  const commandData = yaml.safeLoad(fs.readFileSync(commandFile, 'utf8'));
  // Get a JIRA API connection.
  var jira = jiraClientFromConfig(configData);

  createAllIssues(configData, jira, commandData);
}


var extractColumns = function(data) {
  var issuesAndDates = new Object();
  data.forEach(function(issue) {
    issuesAndDates[issue['Issue key']] = issue['Scheduled end'];
  });
  updateTasks(issuesAndDates);
}

var updateTasks = function(issuesAndDates) {
  var dates = Object.keys(issuesAndDates).map(function(key) {
    return issuesAndDates[key];
  });
  var numberIssues = Object.keys(issuesAndDates).length;
  for (var i = 0; i < numberIssues; i++) {
    var issue = Object.keys(issuesAndDates)[i];
    var duedate = dates[i];
    console.log(`Updating ${issue} Dudedate to ${duedate}...`);
    jira.issue.editIssue(
      {
      "key": issue,
      "fields": {
        "duedate": duedate
      }
    }, function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(`Update for ${issue} complete!`);
      }
    });
  };
}

exports.processFile('./portfolio_test.csv', function (err, fileData) {
  parse(fileData, {columns: true, trim: true}, function(err, data) {
    extractColumns(data);
  });
});
