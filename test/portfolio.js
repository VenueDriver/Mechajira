var sinon = require('sinon')
var assert = require('assert')

const Jira = require('../lib/jira')
const Portfolio = require('../lib/portfolio')

describe('Portfolio', function() {
  describe('#process()', function() {

    it('should make repeated calls to jira.editIssue.',
    async function() {
      var getClientStub = sinon.stub(Jira.prototype, "getClient");
      var editIssueStub = sinon.stub(Jira.prototype, "editIssue").
        resolves({issueKey: 'ABC-123', fields: {'duedate': '2017-10-26'}})
      var portfolio = new Portfolio({silent: true})
      await portfolio.process('test/files/portfolio.csv')
      sinon.assert.callCount(editIssueStub, 4)
      sinon.assert.calledWith(editIssueStub,
          'MECTEST-1',
          { duedate: '2017-11-9' }
        )
      sinon.assert.calledWith(editIssueStub,
          'MECTEST-2',
          { duedate: '2017-11-10' }
        )
      sinon.assert.calledWith(editIssueStub,
          'MECTEST-3',
          { duedate: '2017-12-1' }
        )
      sinon.assert.calledWith(editIssueStub,
          'MECTEST-4',
          { duedate: '2017-12-2' }
        )
      getClientStub.restore()
      editIssueStub.restore()
    })

  })
})
