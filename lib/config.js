var fs = require('fs');
var yaml = require('js-yaml');
var config_path = 'config.yml'

// Compute the configuration hash.
exports.config_data = function (program) {
  // Start with an empty hash.
  var config_data = {};

  // Try to fill the hash with stuff from the config file.
  if (fs.existsSync(config_path)) {
    config_data = yaml.safeLoad(fs.readFileSync(config_path, 'utf8'));
  }

  // Override values provided on the command line.
  if(program.host) {
    config_data['host'] = program.host;
  }
  if(program.port) {
    config_data['port'] = program.port;
  }
  if(program.username) {
    config_data['username'] = program.username;
  }
  if(program.password) {
    config_data['password'] = program.password;
  }
  if(program.verbose) {
    config_data['verbose'] = program.verbose;
  }

  if(config_data['verbose']) {
    console.log("configuration:");
    console.dir(config_data);
  }

  return config_data;
}
