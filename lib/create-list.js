const util = require('util');
const fs = require('fs');
const jiraClient = require('jira-connector');
const yaml = require('js-yaml');
const chalk = require('chalk');

const Jira = require('./jira');

exports.createList = function (configData, commandFile = 'command.yml') {
  if(!configData['silent']) {
    console.log(chalk.bold.cyan('Creating List') +
      ' from command file ' + chalk.bold.cyan(commandFile));
  }
  // Read the command data from the YAML file.
  const commandData = yaml.safeLoad(fs.readFileSync(commandFile, 'utf8'));
  // Get a JIRA API connection.
  var jira = new Jira(configData);

  commandData.summaries.forEach(function(summary) {
    if(!configData['silent']) {
      console.log('Creating issue for ' + chalk.bold.cyan(`${summary}...`));
    }
    var issue_data = {
      'project': commandData.project,
      'issuetype': commandData.issuetype,
      'summary': `${commandData.summary} ${summary}`,
      'description': `${commandData.description} ${summary}`,
      'epic': commandData.epic
    }
    jira.createIssue(issue_data, function(error, issue) {
      if (error) {
        console.log(halk.bold.red(error));
        return;
      } else {
        if(!configData['silent']) {
          console.log(chalk.bold.green(`${issue.key} created`) + ' for ' +
            chalk.bold.cyan(`${summary}`));
        }
      }
    })
  })
}
