# Mechajira

![Mechagodzilla](https://upload.wikimedia.org/wikipedia/en/3/30/Mechagodzilla_Incarnations.jpg)

Mechajira is a Node-based automation tool for creating bulk Jira issues with more control than
Jira's bulk task template plugin. It will eventually become a Node-based bot that responds to
commands in JIRA comments.

Mechjira-bomb.js is like a cluster bomb, creating a batch of tasks on an initial bombing
run, then creating sub-tasks under any number of initial tasks and then creating issue links
between tasks (from the initial batch).

Mechjira-loop.js is more like a Gatling gun, iterating over an array of values to create clones
of a task modeled in a yaml file.

## Configuration  

Mechajira uses the jira-connector module (https://www.npmjs.com/package/jira-connector)
to make calls to Jira's REST API, and relies on a jira.json file (in a /config directory) to
store the 'host', 'username', and 'password' for authentication. We advise creating a new
user with full permissions specifically for Mechjira so all of Mechajira's actions can be
easily monitored.

## Usage

MECHAJIRA-BOMB.JS
Mechajira-bomb.js uses the async module to manage the asynchronous processing of multiple
createIssue() calls and the subsequent creation of sub-tasks and issue links.

The bombsAway() function creates an initial batch of tasks using async.parallel control
flow with a callback including two separate create_____Subtasks() functions and a
linkIssues() function.

The create_____Subtasks() functions take two arguments: (1) a Jira Project key, and
(2) an Issue key from the first batch under which to create the Subtasks.
The linkIssues() function takes the entire issueKeys object created by bombsAway() and
then references individual Issue keys inside each issueLink.createIssueLink() call.

MECHAJIRA-LOOP.JS
Mechajira-loop.js uses a yaml config file to set all of the properties of a model Issue
and then iterates over an array to create clones of the model Issue, inserting the array
items into the Issue summaries.

The config.yml file should look something like this:
project: MEC          // Jira Project key
epic: MEC-90          // Jira Epic key
issuetype: Task       // Jira issue type
summary: Fix
description: More text here...
sites:
 - site 1
 - site 2
 - site 3

Using the example config.yml file above, mechajira-loop.js will iterate over the values
under 'sites' to create three Tasks with the above properties, each one having a
Summary of "Fix [site]"
