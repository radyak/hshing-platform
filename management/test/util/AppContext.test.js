var expect = require("chai").expect;
var AppContext = require("../../src/util/AppContext");
var TypeUtil = require("../../src/util/TypeUtil");

describe("AppContext", function () {
  it("should throw an Error when registering components with invalid names", function (done) {
    var obj = { key: "value" };
    try {
      AppContext.register(" ", obj);
      done("Should not have accepted white-space-only string as name");
    } catch (e) {
      done();
    }
  });

  it("can register and get components", function () {
    var obj = { key: "value" };
    AppContext.register("something", obj);
    var objFromContext = AppContext.something;
    expect(objFromContext).to.deep.equal(obj);

    // var sameObjFromContext = AppContext["someName"];
    // expect(sameObjFromContext).to.deep.equal(obj);
  });

  it("should throw an Error when getting non-registered components", function (done) {
    try {
      AppContext.wrongName;
      done("Should not have returned non-registered component");
    } catch (e) {
      expect(e.toString()).to.equal(
        "Error: No component with name 'wrongName' / key 'wrongname' present in AppContext"
      );
      done();
    }
  });

  describe("dependency injection", function () {

    function Battery() {
      this.getEnergy = function () {
        return "battery";
      };
    }

    class SolarPanel {
      getEnergy() {
        return "solar panel";
      };
    }

    function Flashlight(battery) {
      this.battery = battery;

      this.on = function () {
        if (!this.battery) {
          throw new Error("No battery inserted");
        }
        var source = this.battery.getEnergy();
        return `Flashlight runs with ${source}`;
      };
    }

    it("should not work with Vanilla JS", function (done) {

      var flashlightWithoutDI = new Flashlight();
      try {
        flashlightWithoutDI.on();
        done("Should have thrown an Error");
      } catch (e) {
        done();
      }
    });

    it("should inject dependencies automatically (function class definition)", function () {

      AppContext.register("Battery", Battery);
      AppContext.register("Flashlight", Flashlight);

      expect(TypeUtil.isObject(AppContext.Battery)).to.be.true;
      expect(TypeUtil.isObject(AppContext.Flashlight)).to.be.true;

      expect(AppContext.Flashlight.on()).to.equal("Flashlight runs with battery");
    });

    // Extend to work with classes
    // it("should inject dependencies automatically (new class definition)", function () {

    //   AppContext.register("Battery", SolarPanel);
    //   AppContext.register("Flashlight", Flashlight);

    //   expect(TypeUtil.isObject(AppContext.Battery)).to.be.true;
    //   expect(TypeUtil.isObject(AppContext.Flashlight)).to.be.true;

    //   expect(AppContext.Flashlight.on()).to.equal("Flashlight runs with solar panel");
    // });

    it("should create always the same instances", function () {

      AppContext.register("Battery", Battery);
      AppContext.register("Flashlight", Flashlight);

      expect(AppContext.Battery).to.equal(AppContext.Battery);
      expect(AppContext.Flashlight).to.equal(AppContext.Flashlight);
    });

    it("should ignore case", function () {

      AppContext.register("bAtTeRy", Battery);
      AppContext.register("fLaShLiGhT", Flashlight);

      expect(AppContext.BATtery).to.equal(AppContext.batTERY);
      expect(AppContext.FLASHlight).to.equal(AppContext.FlashLIGHT);

      expect(AppContext.flaSHLight.on()).to.equal("Flashlight runs with battery");
    });
  });
});
