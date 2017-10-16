var util = require('util');
var fs = require('fs');
var jiraClient = require('jira-connector');
var yaml = require('js-yaml');
var chalk = require('chalk');

const jira = require('./jira');

exports.createList = function (configData, commandFile = 'command.yml') {
  console.log(chalk.bold.cyan('Creating List') +
    ' from command file ' + chalk.bold.cyan(commandFile));
  // Read the command data from the YAML file.
  const commandData = yaml.safeLoad(fs.readFileSync(commandFile, 'utf8'));
  // Get a JIRA API connection.
  var jiraClient = jira.jiraClientFromConfig(configData);

  commandData.summaries.forEach(function(summary) {
    console.log('Creating issue for ' + chalk.bold.cyan(`${summary}...`));
    jira.createIssue(jiraClient, commandData, summary, 10, 500, function(error, issue) {
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