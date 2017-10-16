var sinon = require('sinon');

const configData = require('../lib/config').configData;
const jira = require('../lib/jira');
const createList = require('../lib/create-list');

var assert = require('assert');
describe('create-list', function() {
  describe('#createList()', function() {

    it('should make repeated calls to jira.createIssue',
    function() {
      var jiraClient = sinon.stub(jira, "jiraClientFromConfig")
      var createIssueStub = sinon.stub(jira, "createIssue");
      createList.createList({}, 'test/files/create-list.yml');
      sinon.assert.callCount(createIssueStub, 4)
      sinon.assert.calledWith(createIssueStub, sinon.match.any,
        {
          project: { key: "MECTEST" },
          issuetype: { name: "Task" },
          summary: "Do something about alpha",
          description: "This is a task about alpha",
          customfield_10008: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub, sinon.match.any,
        {
          project: { key: "MECTEST" },
          issuetype: { name: "Task" },
          summary: "Do something about beta",
          description: "This is a task about beta",
          customfield_10008: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub, sinon.match.any,
        {
          project: { key: "MECTEST" },
          issuetype: { name: "Task" },
          summary: "Do something about delta",
          description: "This is a task about delta",
          customfield_10008: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub, sinon.match.any,
        {
          project: { key: "MECTEST" },
          issuetype: { name: "Task" },
          summary: "Do something about gamma",
          description: "This is a task about gamma",
          customfield_10008: "MECTEST-1"
        })
    });

  });
});
