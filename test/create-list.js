var sinon = require('sinon')
var assert = require('assert')

const Jira = require('../lib/jira')
const CreateList = require('../lib/create-list')

describe('CreateList', function() {

  describe('#process()', function() {

    it('should make repeated calls to jira.createIssue.',
    async function() {
      var getClientStub = sinon.stub(Jira.prototype, "getClient");
      var createIssueStub = sinon.stub(Jira.prototype, "createIssue").
        resolves({issueKey: 'ABC-123'})
      var createList = new CreateList({silent: true})
      await createList.process('test/files/create-list.yml')
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
      getClientStub.restore()
      createIssueStub.restore()
    })
  })

  describe('#mergedIssueFromCommonValues()', function() {

    it('should return a combined issue hash.',
    async function() {
      var createList = new CreateList({silent: true})
      const mergedIssue = await createList.mergedIssueFromCommonValues(
        // Common fields.
        {
          'project': 'PROJECT',
          'issuetype': 'Task',
          'epic': 'MEC-1',
          'description': 'DESCRIPTION'
        },
        // Fields for this specific issue.
        {
          'summary': 'SUMMARY',
        }
      )
      assert.deepEqual(
        {
          'project': 'PROJECT',
          'issuetype': 'Task',
          'epic': 'MEC-1',
          'description': 'DESCRIPTION',
          'summary': 'SUMMARY'
        },
        mergedIssue
      )
    })

    it('should interpolate values from the issue fields into the common fields.',
    async function() {
      var createList = new CreateList({silent: true})
      const mergedIssue = await createList.mergedIssueFromCommonValues(
        // Common fields.
        {
          'project': 'PROJECT',
          'issuetype': 'Task',
          'epic': 'MEC-1',
          'description': 'Fix {{summary}}',
          'summary': 'Fix {{summary}}'
        },
        // Fields for this specific issue.
        {
          'summary': 'missing meta description tag',
        }
      )
      assert.deepEqual(
        {
          'project': 'PROJECT',
          'epic': 'MEC-1',
          'issuetype': 'Task',
          'description': 'Fix missing meta description tag',
          'summary': 'Fix missing meta description tag'
        },
        mergedIssue
      )
    })

  })
})
