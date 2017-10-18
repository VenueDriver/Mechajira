var nock = require('nock');
var assert = require('assert')

const configData = require('../lib/config').configData
const Jira = require('../lib/jira')

describe('jira', function() {
  describe('#editIssue()', function() {

    it('should make an HTTP call to the editIssue action in the API', async function() {
      nock('https://yourcompany.atlassian.net', {'encodedQueryParams':true})
        .put('/rest/api/2/issue/MECTEST-1', {'fields':{'duedate':'2017-10-26'}})
        .reply(204, '', [])

      nock('https://yourcompany.atlassian.net')
        .get('/rest/api/2/issue/MECTEST-1')
        .reply(200, {'key':'MECTEST-1','fields':{'duedate':'2017-10-26'}}, []);

      var jira = new Jira(configData({}, 'test/files/config.yml'))
      var issueData = {
        duedate: '2017-10-26'
      }
      var jiraIssue = await jira.editIssue('MECTEST-1', issueData)
      assert.equal('2017-10-26', jiraIssue['fields'].duedate)
    })

  })
})
