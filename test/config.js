const configData = require('../lib/config').configData

var assert = require('assert')
describe('config', function() {
  describe('#configData()', function() {

    it('should return the configuration values from the YAML file.',
    function() {
      var config = configData({}, 'test/files/config.yml');
      assert.equal('yourcompany.atlassian.net', config.host);
      assert.equal('443', config.port);
      assert.equal('ryan@yourcompany.com', config.username);
      assert.equal('OpenSesame', config.password);
    });

    it('should allow overriding configuration values from the command line.',
    function() {
      var config = configData(
        {
          'host':     'anothercompany.atlassian.net',
          'port':     '80',
          'username': 'SNOWMAN',
          'password': 'BcraFrfnzr'
        },
        'test/files/config.yml')
      assert.equal('anothercompany.atlassian.net', config.host)
      assert.equal('80', config.port)
      assert.equal('SNOWMAN', config.username)
      assert.equal('BcraFrfnzr', config.password)
    });

  });
});
