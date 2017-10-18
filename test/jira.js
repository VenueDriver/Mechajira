var nock = require('nock');
var assert = require('assert')

const configData = require('../lib/config').configData
const Jira = require('../lib/jira')

describe('jira', function() {
  describe('#editIssue()', function() {

    it('should make an HTTP call to the createIssue action in the API', async function() {
      nock('https://yourcompany.atlassian.net', {'encodedQueryParams':true})
        .post('/rest/api/2/issue', {
          'fields':
            {
              'project':{'key':'PROJECT'},
              'issuetype':{'name':'Task'},
              'summary':'SUMMARY',
              'description':'DESCRIPTION',
              'customfield_10008':'MECTEST-1'}
          })
        .reply(201, {'key':'MECTEST-355'}, [])

      var jira = new Jira(configData({}, 'test/files/config.yml'))
      var issueData = {
        'project': 'PROJECT',
        'issuetype': 'Task',
        'summary': 'SUMMARY',
        'description': 'DESCRIPTION',
        'epic': 'MECTEST-1'
      }
      var jiraIssue = await jira.createIssue(issueData)
      console.log("jiraIssue:")
      console.dir(jiraIssue)
      assert.equal('MECTEST-355', jiraIssue.key)
    })

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
