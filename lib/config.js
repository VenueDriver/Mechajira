var fs = require('fs');
var yaml = require('js-yaml');

// Compute the configuration hash.
exports.configData = function (program, config_path = 'config.yml') {
  console.log("config: " + config_path)
  // Start with an empty hash.
  var configData = {};

  // Try to fill the hash with stuff from the config file.
  if (fs.existsSync(config_path)) {
    configData = yaml.safeLoad(fs.readFileSync(config_path, 'utf8'));
  }

  // Override values provided on the command line.
  if(program.host) {
    configData['host'] = program.host;
  }
  if(program.port) {
    configData['port'] = program.port;
  }
  if(program.username) {
    configData['username'] = program.username;
  }
  if(program.password) {
    configData['password'] = program.password;
  }
  if(program.verbose) {
    configData['verbose'] = program.verbose;
  }

  if(configData['verbose']) {
    console.log("configuration:");
    console.dir(configData);
  }

  return configData;
}
