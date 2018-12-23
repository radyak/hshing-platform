var chai = require("chai");
var fs = require("fs");
var FileIO = require("../../src/util/FileIO");
var expect = chai.expect;
var ConfigService = require("../../src/util/ConfigService");
var FileEnvKeyProvider = require("../../src/util/FileEnvKeyProvider");

var defaultFile = __dirname + "/res/.env.conf";
var defaultKeyFile = __dirname + "/res/.env.key";

var envKeyProvider = new FileEnvKeyProvider(defaultKeyFile);

var defaultConfig = {
  password: "abc123",
  temp: "ephemeral"
};

var reset = function () {
  return Promise.all([
    FileIO.write(defaultFile, JSON.stringify(defaultConfig)),
    FileIO.write(defaultKeyFile, "abc123")
  ])
};

beforeEach(reset);

describe("ConfigService.getConfig", function () {
  it("should get config", function (done) {
    var configService = new ConfigService(defaultFile, envKeyProvider);
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

  it("should handle non-existing files", function (done) {
    var filename = __dirname + "/not/existing.json";
    var configService = new ConfigService(filename, envKeyProvider);
    configService
      .getConfig()
      .then(config => {
        return done(`Should not have been able to find ${filename}`);
      })
      .catch(err => {
        expect(err.code).to.be.equal("ENOENT");
        return done();
      });
  });

  it("should handle bad files", function (done) {
    fs.writeFile(defaultFile, "some non-JSON content", function (err) {
      if (err) {
        console.error("Error occurred while resetting:");
        console.error(err);
      }

      var configService = new ConfigService(defaultFile, envKeyProvider);
      configService
        .getConfig()
        .then(config => {
          return done(`Should not have been able to process ${defaultFile}`);
        })
        .catch(err => {
          return done();
        });
    });
  });
});

describe("ConfigService.addConfig", function () {
  it("should write config", function (done) {
    var configService = new ConfigService(defaultFile, envKeyProvider);
    configService
      .addConfig({
        username: "usr",
        temp: "override",
        complex: { key: "value" }
      })
      .then(config => {
        configService
          .getConfig()
          .then(newConfig => {
            expect(newConfig).to.deep.equal({
              password: "abc123",
              temp: "override",
              username: "usr",
              complex: { key: "value" }
            });
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        return done(err);
      })
      .then(() => {
        return FileIO.read(defaultFile);
      })
      .then(content => {
        try {
          JSON.parse(content);
          done("File content should be encrypted, but was parseable");
        } catch (err) {
          done();
        }
      });
  });
});
