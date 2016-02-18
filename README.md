# Mechajira

![Mechagodzilla](https://upload.wikimedia.org/wikipedia/en/3/30/Mechagodzilla_Incarnations.jpg)

Mechajira is a Ruby-based bot that responds to commands in JIRA comments.

## Behavior Spec

### Feature: Delayed issue resoution

As a project manager who uses JIRA,
I want to leave a comment on a JIRA issue that says to close it a few days from now,
Because I don't want to have to remember to go back and close it a few days from now.

#### Scenario: JIRA user resolves an issue a week later by leaving a comment.

Given that I am an authorized JIRA user,
And given that I am an authorized JIRA bot user,
When I go to an open issue,
And when I comment on that issue "/mechajira done, won't fix, seven days",
And when I wait seven days,
Then Mechajira should resolve the issue,
And the resolution status should be set to "Won't Fix".
