var config = require('./config/jira.json');

var util = require('util');
var jiraClient = require('jira-connector');
var async = require('async');

var jira = new jiraClient({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password
  }
});

var project = 'MEC';
var epic = 'MEC-90';
var issueKeys = {};

//////////////////////////////////////////////////////////////
// Website Standard Task Bomb - Labeled Bytery, Clubs
//////////////////////////////////////////////////////////////

var bombsAway = function(project, epic) {
  async.parallel({
    vipFormKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "VIP Tables Form",
             "description": "Adding task to Epic 'Test Bombing Epic'",
             "issuetype": {
                "name": "Task"
             }
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var vipFormKey = issue.key;
            callback(null, vipFormKey);
          }
        })
    },
    gitSetupKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Git Project Setup",
             "description": "Initialize Git repository and host it on GitHub.",
             "issuetype": {
                "name": "Task"
             }
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var gitSetupKey = issue.key;
            callback(null, gitSetupKey);
          }
        })
    },
    defaultTitleDescKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Select default title, description",
             "description": "Select the title and description that will be used throughout the site. Should be 150 to 160 characters each.",
             "issuetype": {
                "name": "Task"
             }
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var defaultTitleDescKey = issue.key;
            callback(null, defaultTitleDescKey);
          }
        })
    },
    continuousPipeSetupKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Continuous delivery pipeline",
             "description": "Set up a continuous delivery pipeline for both a staging site and a production site.",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "dnorrbom"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
          }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var continuousPipeSetupKey = issue.key;
            callback(null, continuousPipeSetupKey);
          }
        })
    },
    domainSetupKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Domain name setup",
             "description": "Set up the domain name AND sub-domain for staging.",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "dnorrbom"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var domainSetupKey = issue.key;
            callback(null, domainSetupKey);
          }
        })
    },
    previewImageKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Preview image for social media",
             "description": "Design an image for use in previews for Facebook, Twitter, Apple Messenger, etc.",
             "issuetype": {
               "name": "Task"
             },
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
          }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
          } else {
            var previewImageKey = issue.key;
            callback(null, previewImageKey);
          }
        })
    },
    facebookOgKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Facebook Open Graph Tags",
             "description": "Set up Facebook Open Graph tags using the standard page title and description and the social media preview image.",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var facebookOgKey = issue.key;
            callback(null, facebookOgKey);
          }
        })
    },
    twitterCardKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Twitter Card Tags",
             "description": "Set up Twitter cards using the standard page title and description and the social media preview image.",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var twitterCardKey = issue.key;
            callback(null, twitterCardKey);
          }
        })
    },
    heroBannerKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Hero Banner",
             "description": "",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var heroBannerKey = issue.key;
            callback(null, heroBannerKey);
          }
        })
    },
    trackingTagsKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Setup Tracking Tags",
             "description": "Get the Tag Manager container ID from the Google Tag Master and set up the snippet in the site pages. Also add the standard tags listed at https://hakkasan.atlassian.net/wiki/display/WT/Google+Tag+Manager",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "mgarcia"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var trackingTagsKey = issue.key;
            callback(null, trackingTagsKey);
          }
        })
    },
    venueDriverKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Venue Driver ID",
             "description": "",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "dnorrbom"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var venueDriverKey = issue.key;
            callback(null, venueDriverKey);
          }
        })
    },
    marketoFormKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Marketo Form",
             "description": "",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var marketoFormKey = issue.key;
            callback(null, marketoFormKey);
          }
        })
    },
    brandOnTicketPageKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Branding on Ticketing Page",
             "description": "",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var brandOnTicketPageKey = issue.key;
            callback(null, brandOnTicketPageKey);
          }
        })
    },
    brandInDatabaseKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Create Artist Brand in Database",
             "description": "",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "fgalan"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var brandInDatabaseKey = issue.key;
            callback(null, brandInDatabaseKey);
          }
        })
    },
    announcementBlogPostKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Announcement Blog Post",
             "description": "Create blog post to notify ALL stakeholders of coming website.",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "jhand"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var announcementBlogPostKey = issue.key;
            callback(null, announcementBlogPostKey);
          }
        })
    },
    emailAnnouncementKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {
                "key": project
             },
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Email Announcement to Stakeholders",
             "description": "Send email to ALL stakeholders with blog post content",
             "issuetype": {
                "name": "Task"
             },
            //  "assignee": {
            //    "name": "jhand"
            //  },
            //  "labels": [
            //    "the-bytery",
            //    "clubs"
            //  ]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var emailAnnouncementKey = issue.key;
            callback(null, emailAnnouncementKey);
          }
        })
      }
  },
  function(err, results) {
      console.log(results);
  });
};

bombsAway(project, epic);


////////////////////////////////
// CREATE EPIC
////////////////////////////////
// jira.issue.createIssue({
//   "fields": {
//        "project":
//        {
//           "key": "MEC"
//        },
//        "summary": "Test Epic",
//        "description": "Creating test epic for test bulk task bombing runs...",
//        "issuetype": {
//           "name": "Epic"
//        },
//        "customfield_10009": "Test Bombing Epic"    // Epic name is required
//    }
// }, function(error, issue) {
//   if (error) {
//    console.log(error);
//    return;
//   }
//   console.log(issue);
// });
