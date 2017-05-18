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

var project = 'OAK';
var epic = 'OAK-74';
var issueKeys = {};

// DEFINE INITIAL TASK BOMB
var bombsAway = function(project, epic) {
  console.log("Creating issues...");
  async.parallel({
    vipFormKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "VIP Tables Form",
             "description": "",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Git Project Setup",
             "description": "Initialize Git repository and host it on GitHub.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Select default title, description",
             "description": "Select the title and description that will be used throughout the site. Should be 150 to 160 characters each.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery","clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Continuous delivery pipeline",
             "description": "Set up a continuous delivery pipeline for both a staging site and a production site.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "dnorrbom"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Domain name setup",
             "description": "Set up the domain name AND sub-domain for staging.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "dnorrbom"},
             "labels": ["the-bytery", "clubs"]
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
    yoastPremiumKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Install Yoast Premium plugin",
             "description": "Install Yoast Premium plugin to handle redirects",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "dnorrbom"},
             "labels": ["the-bytery", "clubs"]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var yoastPremiumKey = issue.key;
            callback(null, yoastPremiumKey);
          }
        })
    },
    heroBannerKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Hero Banner",
             "description": "",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
    previewImageKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Preview image for social media",
             "description": "Design an image for use in previews for Facebook, Twitter, Apple Messenger, etc.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Facebook Open Graph Tags",
             "description": "Set up Facebook Open Graph tags using the standard page title and description and the social media preview image.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Twitter Card Tags",
             "description": "Set up Twitter cards using the standard page title and description and the social media preview image.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
    trackingTagsKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Setup Tracking Tags",
             "description": "Get the Tag Manager container ID from the Google Tag Master and set up the snippet in the site pages. Also add the standard tags listed at https://hakkasan.atlassian.net/wiki/display/WT/Google+Tag+Manager",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "mgarcia"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Venue Driver ID",
             "description": "",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "dnorrbom"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Marketo Form",
             "description": "",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Branding on Ticketing Page",
             "description": "",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Create Artist Brand in Database",
             "description": "",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "fgalan"},
             "labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Announcement Blog Post",
             "description": "Create blog post to notify ALL stakeholders of coming website.",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "jhand"}
             //"labels": ["the-bytery", "clubs"]
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
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Email Announcement to Stakeholders",
             "description": "Send email to ALL stakeholders with blog post content",
             "issuetype": {"name": "Task"},
             "assignee": {"name": "jhand"}
             //"labels": ["the-bytery", "clubs"]
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
    },
    finalMarketingApprovalKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Final Marketing Approval",
             "description": "Mark this approved once the key stakeholders in Marketing all agree that it's approved.",
             "issuetype": {"name": "Approval"},    // MAKE SURE THIS ISSUE TYPE IS ALLOWED IN THE PROJECT SETTINGS
             "assignee": {"name": "jhand"}
             //"labels": ["the-bytery", "clubs"]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var finalMarketingApprovalKey = issue.key;
            callback(null, finalMarketingApprovalKey);
          }
        })
    },
    finalTechnicalApprovalKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Final Technical Approval",
             "description": "This will be approved once the QA checklist passes.",
             "issuetype": {"name": "Approval"},     // MAKE SURE THIS ISSUE TYPE IS ALLOWED IN THE PROJECT SETTINGS
             "assignee": {"name": "dcollado"}
            //  "labels": ["the-bytery", "clubs"]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var finalTechnicalApprovalKey = issue.key;
            callback(null, finalTechnicalApprovalKey);
          }
        })
    },
    finalCreativeApprovalKey: function(callback) {
      jira.issue.createIssue(
        {
          "fields": {
             "project": {"key": project},
             "customfield_10008": epic,   // Epic within which to create task
             "summary": "Final Creative Approval",
             "description": "",
             "issuetype": {"name": "Approval"},      // MAKE SURE THIS ISSUE TYPE IS ALLOWED IN THE PROJECT SETTINGS
             "assignee": {"name": "jhand"}
            //  "labels": ["the-bytery", "clubs"]
           }
        },
        function(error, issue) {
          if (error) {
            console.log(error);
            return;
          } else {
            var finalCreativeApprovalKey = issue.key;
            callback(null, finalCreativeApprovalKey);
          }
        })
      }
    },
    function(err, issueKeys) {
      console.log('Successfuly created issues with the following Keys:');
      console.log(issueKeys);
      createTechQaSubtasks(project, issueKeys.finalTechnicalApprovalKey);
      createTrackingTagSubtasks(project, issueKeys.trackingTagsKey);
      linkIssues(issueKeys);
    });
}

// FUNCTION TO CREATE QA SUBTASKS UNDER "Final Technical Approval" APPROVAL ISSUE
var createTechQaSubtasks = function(project, parent) {
  console.log('Creating Tech QA Sub-tasks...');
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Passes Google Mobile-Friendly Test",
        "description": "Submit page/site URL to Google's Mobile-Friendly Test tool at https://www.google.com/webmasters/tools/mobile-friendly/Paste a link to the results page in the comments below when complete.",
        "issuetype": {"name": "Sub-task"}
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaMobileFriendlyKey = issue.key;
        issueKeys.techQaMobileFriendlyKey = techQaMobileFriendlyKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Validate HTML",
        "description": "Submit the page/site URL to the HTML Validator tool found at https://validator.w3.org/Paste a link to the results page in the comments below when complete.",
        "issuetype": {"name": "Sub-task"}
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaValidateHtmlKey = issue.key;
        issueKeys.techQaValidateHtmlKey = techQaValidateHtmlKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "DRY",
        "description": "Don't Repeat Yourself (with code)",
        "issuetype": {"name": "Sub-task"}
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaDryKey = issue.key;
        issueKeys.techQaDryKey = techQaDryKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Check Cross-browser Compatibility",
        "description": "Browserstack.com (must support iOS 5.1+, iPhone, iPhone 6+, iPad)",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaBrowserstackKey = issue.key;
        issueKeys.techQaBrowserstackKey = techQaBrowserstackKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Robots meta tag",
        "description": "Make sure robots meta tag is set to 'index, follow'",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaRobotsKey = issue.key;
        issueKeys.techQaRobotsKey = techQaRobotsKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Form Legal Terms",
        "description": "Make sure forms collecting personally identifying information require Privacy Policy checkbox. Also make sure ticket purchase forms require Ticket Purchase Terms checkbox.",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaLegalTermsKey = issue.key;
        issueKeys.techQaLegalTermsKey = techQaLegalTermsKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Validate Twitter card",
        "description": "Submit URL to Twitter's card validator located at https://cards-dev.twitter.com/validator.",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaTwitterCardKey = issue.key;
        issueKeys.techQaTwitterCardKey = techQaTwitterCardKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Validate Facebook OG tags",
        "description": "Submit URL to Facebook OG tag validator at https://developers.facebook.com/tools/debug/",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaFacebookOgKey = issue.key;
        issueKeys.techQaFacebookOgKey = techQaFacebookOgKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Check Title, Description meta tags",
        "description": "Should be less than 160 character",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaTitleDescriptionKey = issue.key;
        issueKeys.techQaTitleDescriptionKey = techQaTitleDescriptionKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Google Tag Manager container",
        "description": "Make sure Container ID in source code matches ID in GTM console and tags are setup according to tag policy at https://hakkasan.atlassian.net/wiki/display/WT/Google+Tag+Manager",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaGtmSetupKey = issue.key;
        issueKeys.techQaGtmSetupKey = techQaGtmSetupKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Tag Inspector Audit",
        "description": "Submit URL to the Tag Inspector tool at https://app.taginspector.com. Make sure to use our corporate Pro account. Read more about Tag Inspector at https://hakkasan.atlassian.net/wiki/display/WT/Tag+Inspector",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaTagInspectorKey = issue.key;
        issueKeys.techQaTagInspectorKey = techQaTagInspectorKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Custom 404 Page",
        "description": "",
        "issuetype": {"name": "Sub-task"},
        //  "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var techQaCustom404Key = issue.key;
        issueKeys.techQaCustom404Key = techQaCustom404Key;
      }
    });
}

// FUNCTION TO CREATE SUBTASKS UNDER "Setup Tracking Tags" Task
var createTrackingTagSubtasks = function(project, parent) {
  console.log('Creating Tracking Tags Sub-tasks...');
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Google Tag Manager - Generate Code",
        "description": "Generate GTM container ID and post in comments below, tagging the appropriate Bytery representative",
        "issuetype": {"name": "Sub-task"},
        "assignee": {"name": "mgarcia"}
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var trackingGtmCodeKey = issue.key;
        issueKeys.trackingGtmCodeKey = trackingGtmCodeKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Google Tag Manager - Install Code",
        "description": "Add the GTM container code and ID to the source code.",
        "issuetype": {"name": "Sub-task"},
        "assignee": {"name": "mgarcia"}
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var trackingGtmInstallKey = issue.key;
        issueKeys.trackingGtmInstallKey = trackingGtmInstallKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Setup Adroll Tag in GTM",
        "description": "",
        "issuetype": {"name": "Sub-task"},
        "assignee": {"name": "mgarcia"}
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var trackingAdrollKey = issue.key;
        issueKeys.trackingAdrollKey = trackingAdrollKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Setup Facebook Pixel in GTM",
        "description": "",
        "assignee": {"name": "mgarcia"}
        "assignee": {"name": "jhand"},
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var trackingFacebookKey = issue.key;
        issueKeys.trackingFacebookKey = trackingFacebookKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Setup Movable Ink tags in GTM",
        "description": "",
        "issuetype": {"name": "Sub-task"},
        "assignee": {"name": "mgarcia"}
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var trackingFacebookKey = issue.key;
        issueKeys.trackingMovableInkKey = trackingFacebookKey;
      }
    });
  jira.issue.createIssue(
    {
      "fields": {
        "parent": {"key": parent},
        "project": {"key": project},
        "summary": "Setup Marketo Munchkin in GTM",
        "description": "",
        "issuetype": {"name": "Sub-task"},
        "assignee": {"name": "mgarcia"}
        //  "labels": ["the-bytery", "clubs"]
      }
    },
    function(error, issue) {
      if (error) {
        console.log(error);
        return;
      } else {
        var trackingMarketoKey = issue.key;
        issueKeys.trackingMarketoKey = trackingMarketoKey;
      }
    });
}

// FUNCTION FOR LINKING ISSUES
var linkIssues = function(issueKeys) {
  console.log('Linking issues...');
  jira.issueLink.createIssueLink(
    {
      "issueLink": {
        "type": {"name": "Blocks"},
        "inwardIssue": {"key": issueKeys.previewImageKey},
        "outwardIssue": {"key": issueKeys.twitterCardKey},
        "comment": {"body": "Can't create Twitter Card image tag until preview image is set"}
      }
    },
    function(error, result) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(result);
      }
    });
  jira.issueLink.createIssueLink(
    {
      "issueLink": {
        "type": {"name": "Blocks"},
        "inwardIssue": {"key": issueKeys.previewImageKey},
        "outwardIssue": {"key": issueKeys.facebookOgKey},
        "comment": {"body": "Can't create Facebook OG image tag until preview image is set"}
      }
    },
    function(error, result) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(result);
      }
    });
  jira.issueLink.createIssueLink(
    {
      "issueLink": {
        "type": {"name": "Relates"},
        "inwardIssue": {"key": issueKeys.previewImageKey},
        "outwardIssue": {"key": issueKeys.heroBannerKey},
        "comment": {"body": "Preview image and Hero banner are usually the same image, but maybe different sizes"}
      }
    },
    function(error, result) {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(result);
      }
    });
};

// CALL INITIAL TASK BOMB
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
