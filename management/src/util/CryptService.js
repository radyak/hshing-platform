var crypto = require("crypto");
var SimpleParamCheck = require("./SimpleParamCheck");

function CryptService(customConfig) {
  var CONFIG = Object.assign(
    {
      algorithm: "aes-256-ctr",
      password: null
    },
    customConfig
  );

  SimpleParamCheck.checkForFalsy(CONFIG);

  this.encrypt = function(text) {
    var cipher = crypto.createCipher(CONFIG.algorithm, CONFIG.password);
    var crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  };

  this.decrypt = function(text) {
    var decipher = crypto.createDecipher(CONFIG.algorithm, CONFIG.password);
    var dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  };
}

module.exports = CryptService;
