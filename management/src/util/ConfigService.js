var fs = require("fs");

function ConfigService(customConfig) {
  var config = Object.assign(
    {
      file: __dirname + "/.env.json"
    },
    customConfig
  );

  this.getConfig = function() {
    var promise = new Promise((resolve, reject) => {
      var readStream = fs.createReadStream(config.file);
      readStream.on("error", err => {
        reject(err);
      });
      readStream.on("data", chunk => {
        var data = chunk.toString("utf8");
        try {
          var config = JSON.parse(data);
          resolve(config);
        } catch (e) {
          reject(e);
        }
      });
    });
    return promise;
  };

  this.addConfig = function(subConfig) {
    this.getConfig().then(config => {});
  };
}

module.exports = ConfigService;
