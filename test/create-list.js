var sinon = require('sinon')

const configData = require('../lib/config').configData
const Jira = require('../lib/jira')
const createList = require('../lib/create-list')

var assert = require('assert')
describe('create-list', function() {
  describe('#createList()', function() {

    it('should make repeated calls to jira.createIssue',
    async function() {
      var getClientStub = sinon.stub(Jira.prototype, "getClient");
      var createIssueStub = sinon.stub(Jira.prototype, "createIssue").
        resolves({issueKey: 'ABC-123'})
      await createList.createList({silent: true}, 'test/files/create-list.yml')
      sinon.assert.callCount(createIssueStub, 4)
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          issuetype: "Task",
          summary: "Do something about alpha",
          description: "This is a task about alpha",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          issuetype: "Task",
          summary: "Do something about beta",
          description: "This is a task about beta",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          issuetype: "Task",
          summary: "Do something about delta",
          description: "This is a task about delta",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          issuetype: "Task",
          summary: "Do something about gamma",
          description: "This is a task about gamma",
          epic: "MECTEST-1"
        })
    })

  })
})
