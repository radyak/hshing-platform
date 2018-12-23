var FileIO = require("./FileIO");
var CryptService = require("./CryptService");
var deepmerge = require("deepmerge");

function ConfigService(configFile, keyProvider) {
  var isJson = function (string) {
    try {
      JSON.parse(string);
    } catch (e) {
      return false;
    }
    return true;
  };

  this.getConfig = function () {
    return Promise.all([
      FileIO.read(configFile),
      keyProvider.get()
    ]).then(values => {
      var configString = values[0].toString("utf8");
      var key = values[1].toString("utf8");

      // Content was not encrypted, parse directly
      if (isJson(configString)) {
        return JSON.parse(configString);
      }

      // Content WAS encrypted, decrypt previously
      var cryptService = new CryptService({
        password: key
      });
      var decryptedConfigString = cryptService.decrypt(configString);
      if (isJson(decryptedConfigString)) {
        return JSON.parse(decryptedConfigString);
      }

      // Unreadable, since content was neither unencrypted nor decryptable with provided key
      throw new Error(`${configFile} is not JSON (${configString})`);
    });
  };

  this.addConfig = function (subConfig) {
    return Promise.all([this.getConfig(), keyProvider.get()]).then(
      values => {
        var config = values[0];
        var key = values[1].toString();
        var result = deepmerge(config, subConfig);
        var cryptService = new CryptService({
          password: key
        });
        var encryptedResult = cryptService.encrypt(JSON.stringify(result));
        return FileIO.write(configFile, encryptedResult);
      }
    );
  };

  this.addConfig({}).then(() => {
    console.log("done");
  });
}

module.exports = ConfigService;
