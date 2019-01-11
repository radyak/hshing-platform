var chai = require("chai");
var expect = chai.expect;

var CryptService = require("../../src/util/CryptService");

var defaultConfig = {
  password: "abc123"
};

describe("CryptService", function() {
  it("should throw error on initialization without password", function(done) {
    try {
      new CryptService({
        password: null
      });
      done(`Should not have been initialized with password 'null'`);
    } catch (err) {
      done();
    }
  });

  it("should encrypt a string", function() {
    var cryptService = new CryptService(defaultConfig);
    var encrypted = cryptService.encrypt("string to be encrypted");
    expect(encrypted).to.be.equal(
      "862b591447379276a1681380756af105bf9dd2d1b35f"
    );
  });
});
