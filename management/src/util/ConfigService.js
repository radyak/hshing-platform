var fs = require("fs");
var deepmerge = require("deepmerge");

function ConfigService(customConfig) {
  var config = Object.assign(
    {
      file: __dirname + "/.env.json"
    },
    customConfig
  );

  var read = function() {
    var promise = new Promise((resolve, reject) => {
      fs.readFile(config.file, (err, content) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(content);
      });
    });
    return promise;
  };

  var write = function(content) {
    var promise = new Promise((resolve, reject) => {
      fs.writeFile(config.file, content, err => {
        if (err) {
          reject(e);
          return;
        }
        resolve();
      });
    });
    return promise;
  };

  this.getConfig = function() {
    return read().then(configString => {
      return JSON.parse(configString);
    });
  };

  this.addConfig = function(subConfig) {
    return this.getConfig().then(config => {
      var result = deepmerge(config, subConfig);
      return write(JSON.stringify(result));
    });
  };
}

module.exports = ConfigService;
