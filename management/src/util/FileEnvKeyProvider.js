var FileIO = require("./FileIO");

function FileEnvKeyProvider(customConfig) {
  var CONFIG = Object.assign(
    {
      file: __dirname + "/.env.key"
    },
    customConfig
  );

  this.get = function() {
    return FileIO.read(CONFIG.file);
  };
}

module.exports = FileEnvKeyProvider;
