var expect = require("chai").expect;
var AppContext = require("../../src/util/AppContext");

describe("AppContext", function() {
  it("should throw an Error when registering components with invalid names", function(done) {
    var obj = { key: "value" };
    try {
      AppContext.register(" ", obj);
      done("Should not have accepted white-space-only string as name");
    } catch (e) {
      done();
    }
  });

  it("can register and get components", function() {
    var obj = { key: "value" };
    AppContext.register("someName", obj);
    var objFromContext = AppContext.get("someName");
    expect(objFromContext).to.deep.equal(obj);
  });

  it("should throw an Error when getting non-registered components", function(done) {
    try {
      AppContext.get("wrongName");
      done("Should not have returned non-registered component");
    } catch (e) {
      expect(e.toString()).to.equal(
        "Error: No component with name wrongName present in AppContext"
      );
      done();
    }
  });
});
