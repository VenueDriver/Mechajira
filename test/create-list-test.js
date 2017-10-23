var sinon = require('sinon')
var assert = require('assert')

const Jira = require('../lib/jira')
const CreateList = require('../lib/create-list')
var sandbox = sinon.sandbox.create();

describe('CreateList', function() {

  describe('#process()', function() {

    afterEach(function () { sandbox.restore(); });

    it('should create JIRA issues from a YAML list of summaries.',
    async function() {
      var getClientStub = sandbox.stub(Jira.prototype, "getClient");
      var createIssueStub = sandbox.stub(Jira.prototype, "createIssue").
        resolves({key: 'ABC-123'})
      var createList = new CreateList({silent: true})
      await createList.process('test/files/create-list-from-summaries.yml')
      sinon.assert.callCount(createIssueStub, 4)
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Task",
          summary: "Do something about alpha",
          description: "This is a task about alpha",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Task",
          summary: "Do something about beta",
          description: "This is a task about beta",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Task",
          summary: "Do something about delta",
          description: "This is a task about delta",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Task",
          summary: "Do something about gamma",
          description: "This is a task about gamma",
          epic: "MECTEST-1"
        })
    })

    it('should create JIRA issues from a YAML list of issue hashes.',
    async function() {
      var getClientStub = sandbox.stub(Jira.prototype, "getClient");
      var createIssueStub = sandbox.stub(Jira.prototype, "createIssue").
        resolves({key: 'MECTEST-123'})
      var createList = new CreateList({silent: true})
      await createList.process('test/files/create-list-from-issues.yml')
      sinon.assert.callCount(createIssueStub, 6)
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Story",
          summary: "Do something about alpha",
          description: "This is a task about ALPHA",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Task",
          summary: "Do something about beta",
          description: "This is a task about BETA",
          epic: "MECTEST-1",
          labels: ["show-stopper", "critical-1"]
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Bug",
          summary: "Do something about gamma",
          description: "This is a task about GAMMA",
          epic: "MECTEST-1"
        })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Sub-task",
          parent: 'MECTEST-123',
          summary: "one",
          description: "one"
        })
    })

    it('should create epics with nested issues under them.',
    async function() {
      var getClientStub = sandbox.stub(Jira.prototype, "getClient");
      var createIssueStub = sandbox.stub(Jira.prototype, "createIssue").
        resolves({key: 'MECTEST-123'})
      var createList = new CreateList({silent: true})
      await createList.process('test/files/create-list-of-epics.yml')
      sinon.assert.callCount(createIssueStub, 13)
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Epic",
          summary: "Design",
          description: "Design some magic!"
        })
        sinon.assert.calledWith(createIssueStub,
          {
            project: "MECTEST",
            type: "Task",
            summary: "Sketch some magic.",
            description: "Sketch some magic.",
            epic: 'MECTEST-123'
          })
        sinon.assert.calledWith(createIssueStub,
          {
            project: "MECTEST",
            type: "Task",
            summary: "Revise the magic.",
            description: "Revise the magic.",
            epic: 'MECTEST-123'
          })
        sinon.assert.calledWith(createIssueStub,
          {
            project: "MECTEST",
            type: "Approval",
            summary: "Marketing approval.",
            description: "Marketing approval.",
            epic: 'MECTEST-123'
          })
      sinon.assert.calledWith(createIssueStub,
        {
          project: "MECTEST",
          type: "Epic",
          summary: "Design",
          description: "Design some magic!"
        })
        sinon.assert.calledWith(createIssueStub,
          {
            project: "MECTEST",
            type: "Story",
            summary: "Some magic happens.",
            description: "Some magic happens.",
            epic: 'MECTEST-123'
          })
        sinon.assert.calledWith(createIssueStub,
          {
            project: "MECTEST",
            type: "Task",
            summary: "Make some magic.",
            description: "Make some magic.",
            epic: 'MECTEST-123'
          })
          sinon.assert.calledWith(createIssueStub,
            {
              project: "MECTEST",
              type: "Sub-task",
              parent: 'MECTEST-123',
              summary: "one",
              description: "one"
            })
          sinon.assert.calledWith(createIssueStub,
            {
              project: "MECTEST",
              type: "Sub-task",
              parent: 'MECTEST-123',
              summary: "one",
              description: "one"
            })
          sinon.assert.calledWith(createIssueStub,
            {
              project: "MECTEST",
              type: "Sub-task",
              parent: 'MECTEST-123',
              summary: "one",
              description: "one"
            })
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
          'type': 'Task',
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
          'type': 'Task',
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
          'type': 'Task',
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
          'type': 'Task',
          'description': 'Fix missing meta description tag',
          'summary': 'Fix missing meta description tag'
        },
        mergedIssue
      )
    })

  })
})
