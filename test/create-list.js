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
      sinon.assert.calledWith(createIssueStub, sinon.match.any, sinon.match.any,
        'alpha', 10, 500, sinon.match.any)
      sinon.assert.calledWith(createIssueStub, sinon.match.any, sinon.match.any,
        'beta', 10, 500, sinon.match.any)
      sinon.assert.calledWith(createIssueStub, sinon.match.any, sinon.match.any,
        'delta', 10, 500, sinon.match.any)
      sinon.assert.calledWith(createIssueStub, sinon.match.any, sinon.match.any,
        'gamma', 10, 500, sinon.match.any)
    });

  });
});
