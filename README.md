# Mechajira

![Mechagodzilla](https://upload.wikimedia.org/wikipedia/en/3/30/Mechagodzilla_Incarnations.jpg)

Mechajira is a Node-based automation tool for doing high-level JIRA procedures.
Higher-level than the basic API connector code that it's built on.

For example, the basic API connector can create, update or delete a JIRA issue.
Mechajira can read a YAML file and create a dozen issues all at once using the
YAML as a template.  Great for enabling a standardized workflow, where you need
to create the epics with tasks in the same configuration repeatedly.

# Installation

Clone this project, and install the ```mechajira``` command using NPM, with:

    npm install -g

After that, you should have the command in your path:

    mechajira --help

(If that doesn't work then try ```npm link```.)

# Commands

Each high-level procedure is encapsulated in a sub-commmand.  You can see the
list of available commands with:

    mechajira --help

You can get help on a specific command:

    mechajira --help loop

The available commands:

## create-loop
_Create a list of new JIRA issues with titles from a YAML file_

The ```create-loop``` command reads a YAML file.  The file includes context, and
a list of titles.  The command iterates over the list and creates JIRA issues
with those titles.  It will set the Epic for each new issue to the Epic
specified in the YAML file.

Use this when you have an existing Epic in JIRA, and you want to create a list
of Tasks or Stories or Bugs or something under that Epic.  Maybe you're doing QA
on something, so you open a "QA on Something" epic, and you start taking notes.
You can list your issues in the YAML file during QA and then run this command at
the end to create a list of Bug issues all at once.

### Create issues from a list of summaries

With this option, you can specify a "summaries" list in the YAML file.  Each new
issue created will also include the common fields at the top of the YAML file.

Example:

    mechajira create-loop summary-list.yml

The ```summary-list.yml``` file should look something like this:

    project: MEC          # Jira Project key
    epic: MEC-1           # Jira Epic key
    issuetype: Bug        # Jira issue type
    summary: Fix {{summary}}
    description: More text here...
    summaries:
     - missing meta description tag
     - incorrect Facebook Open Graph image
     - wrong Google Tag Manager container ID

Using the example config.yml file above, mechajira-loop.js will iterate over the
values under 'sites' to create three Bug issues under the Epic "MEC-1" with the
above properties, with these summaries:

1. ```Fix missing meta description tag```
2. ```Fix incorrect Facebook Open Graph image```
3. ```Fix wrong Google Tag Manager container ID```

### Create issues from a list of issues

With this option, you can specify an "issues" hash in the YAML file.  Instead of a list of summaries.  You can specify any arbitrary fields in those issue hashes.  As long as JIRA is happy with it.

You can use this to create a list of different issue types.  Maybe you have a standard JIRA Epic template that

Example:

    mechajira create-loop issue-list.yml

The ```issue-list.yml``` file should look something like this:

    project: MEC
    epic: MEC-1
    issues:
      - issuetype: Story
        summary: As a user I want to log in
      - issuetype: Story
        summary: As a user I want to log out
      - issuetype: Task
        summary: Implement authentication stories
      - issuetype: Approval
        summary: QA approval

## portfolio
_Update JIRA issues from a JIRA Portfolio export CSV file._

The ```portfolio``` command reads a CSV file, in the format that JIRA Portfolio exports from the "Scope" report.  It looks for the "Scheduled End" date for each issue, and updates the "Due Date" of that JIRA issue with the scheduled end date.

Use this when you want to use JIRA Portfolio to calculate the due dates on
issues based on the calculated schedule.  This can be useful for communicating
the schedule to task workers through normal JIRA channels.  The authors of this
command use kanban boards in JIRA with swim lanes based on due dates.  This
Mechajira command connects the dots between JIR portfolio and those kanban
boards.

Example:

    mechajira portfolio Engineering_Departme_Scope_20171026.csv

The output should look a little like this:

    $ mechajira portfolio portfolio/Engineering_Departme_Scope_20171017.csv
    Updating issues from JIRA Portfolio export portfolio/Engineering_Departme_Scope_20171017.csv
    Skipping issue MEC-1, with no scheduled end date.
    Setting due date on MEC-2 to 13/Nov/17...
    MEC-2 due date updated to 2017-11-13.
    Setting due date on MEC-3 to 13/Nov/17...
    MEC-3 due date updated to 2017-11-13.

# Configuration  

You can pass in the ```host```, ```username``` and ```password``` for your JIRA instance as options on the command line.  For example:

    mechajira loop -u user1 -p pass1 -h yourcompany.atlassian.net list.yml

Mechajira will also look for a ```config.yml``` file in the current folder.  You
can store your access information so that you don't have to pass it as a
parameter each time you run a command.

    host: yourcompany.atlassian.net
    username: user1
    password: pass1

## Testing

From the project folder, run the tests with:

    npm test

To calculate test coverage and update Coveralls:

    npm run coverage
