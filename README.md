# Mechajira

![Mechagodzilla](https://upload.wikimedia.org/wikipedia/en/3/30/Mechagodzilla_Incarnations.jpg)

Mechajira is a Node-based automation tool for doing high-level JIRA procedures.
Higher-level than the basic API connector code that it's built on.

For example, the basic API connector can create, update or delete a JIRA issue.
Mechajira can read a YAML file and create a dozen issues all at once using the
YAML as a template.  Great for enabling a standardized workflow, where you need to create the epics with tasks in the same configuration repeatedly.

# Commands

Each high-level procedure is encapsulated in a sub-commmand:

## loop - Create a list of new JIRA issues with titles from a YAML file

The ```loop``` command reads a YAML file.  The file includes context, and a list
of titles.  The command iterates over the list and creates JIRA issues with
those titles.

Example:

    mechajira loop list.yml

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

Using the example config.yml file above, mechajira-loop.js will iterate over the
values under 'sites' to create three Tasks with the above properties, each one
having a Summary of "Fix [site]"

## bomb - Create many issues from a YAML file template

The ```bomb``` command creates JIRA issues from a YAML file template.  It can
create sub-tasks under any number of initial tasks and then create issue links
between tasks.

# Configuration  

You can pass in the ```host```, ```username``` and ```password``` for your JIRA instance as options on the command line.  For example:

    mechajira loop -u user1 -p pass1 -h ourcompany.atlassian.net list.yml

Mechajira will also look for a ```config.yml``` file in the current folder.  You
can store your access information so that you don't have to pass it as a
parameter each time you run a command.

    host: ourcompany.atlassian.net
    username: user1
    password: pass1
