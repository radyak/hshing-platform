var chai = require("chai");
var fs = require("fs");
var expect = chai.expect;

var ConfigService = require("../../src/util/ConfigService");

var defaultFile = __dirname + "/res/.env.json";
var defaultConfig = {
  password: "abc123"
};

afterEach(function() {
  fs.writeFile(defaultFile, JSON.stringify(defaultConfig), function(err) {
    if (err) {
      console.error("Error occurred while resetting:");
      console.error(err);
    }
  });
});

describe("ConfigService", function() {
  it("should get config", function(done) {
    var filename = defaultFile;
    var configService = new ConfigService({
      file: filename
    });
    configService
      .getConfig()
      .then(config => {
        console.log(`config is ${JSON.stringify(config)}`);
        expect(config).to.deep.equal(defaultConfig);
        return done();
      })
      .catch(err => {
        console.error(err);
        return done(err);
      });
  });

  it("should handle non-existing files", function(done) {
    var filename = __dirname + "/not/existing.json";
    var configService = new ConfigService({
      file: filename
    });
    configService
      .getConfig()
      .then(config => {
        return done(`Should not have been able to find ${filename}`);
      })
      .catch(err => {
        return done();
      });
  });

  //   it("should stabd simple test", function() {
  //     var x = 5;
  //     var y = 1;
  //     var sum = x + y;

  //     console.log(__dirname);

  //     expect(sum).to.be.equal(6);
  //   });
});
