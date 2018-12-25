var expect = require("chai").expect;
var TypeUtil = require("../../src/util/TypeUtil");

describe("TypeUtils", function () {
  describe("isObject", function () {
    it("should recognize objects created with function definition", function () {
      function FunctionObjectDefinition() { }
      var object = new FunctionObjectDefinition();
      expect(TypeUtil.isArray(object)).is.false;
      expect(TypeUtil.isBoolean(object)).is.false;
      expect(TypeUtil.isFunction(object)).is.false;
      expect(TypeUtil.isNumber(object)).is.false;
      expect(TypeUtil.isObject(object)).is.true;
      expect(TypeUtil.isString(object)).is.false;
    });

    it("should recognize objects created with class definition", function () {
      class ClassObjectDefinition { }
      var object = new ClassObjectDefinition();
      expect(TypeUtil.isArray(object)).is.false;
      expect(TypeUtil.isBoolean(object)).is.false;
      expect(TypeUtil.isFunction(object)).is.false;
      expect(TypeUtil.isNumber(object)).is.false;
      expect(TypeUtil.isObject(object)).is.true;
      expect(TypeUtil.isString(object)).is.false;
    });

    it("should recognize objects created with direct definition", function () {
      var object = {};
      expect(TypeUtil.isArray(object)).is.false;
      expect(TypeUtil.isBoolean(object)).is.false;
      expect(TypeUtil.isFunction(object)).is.false;
      expect(TypeUtil.isObject(object)).is.true;
      expect(TypeUtil.isNumber(object)).is.false;
      expect(TypeUtil.isString(object)).is.false;
    });
  });

  describe("isFunction", function () {
    it("should recognize functions", function () {
      function someFunction() { }
      expect(TypeUtil.isArray(someFunction)).is.false;
      expect(TypeUtil.isBoolean(someFunction)).is.false;
      expect(TypeUtil.isFunction(someFunction)).is.true;
      expect(TypeUtil.isFunction(new someFunction())).is.false;
      expect(TypeUtil.isNumber(someFunction)).is.false;
      expect(TypeUtil.isObject(someFunction)).is.false;
      expect(TypeUtil.isString(someFunction)).is.false;
    });

    it("should recognize class definitions as functions", function () {
      class ClassObjectDefinition { }
      expect(TypeUtil.isArray(ClassObjectDefinition)).is.false;
      expect(TypeUtil.isBoolean(ClassObjectDefinition)).is.false;
      expect(TypeUtil.isFunction(ClassObjectDefinition)).is.true;
      expect(TypeUtil.isFunction(new ClassObjectDefinition())).is.false;
      expect(TypeUtil.isObject(ClassObjectDefinition)).is.false;
      expect(TypeUtil.isNumber(ClassObjectDefinition)).is.false;
      expect(TypeUtil.isString(ClassObjectDefinition)).is.false;
    });
  });

  it("should recognize booleans", function () {
    var test = false;
    expect(TypeUtil.isArray(test)).is.false;
    expect(TypeUtil.isBoolean(test)).is.true;
    expect(TypeUtil.isFunction(test)).is.false;
    expect(TypeUtil.isNumber(test)).is.false;
    expect(TypeUtil.isObject(test)).is.false;
    expect(TypeUtil.isString(test)).is.false;
  });

  it("should recognize strings", function () {
    var test = "";
    expect(TypeUtil.isArray(test)).is.false;
    expect(TypeUtil.isBoolean(test)).is.false;
    expect(TypeUtil.isFunction(test)).is.false;
    expect(TypeUtil.isNumber(test)).is.false;
    expect(TypeUtil.isObject(test)).is.false;
    expect(TypeUtil.isString(test)).is.true;
  });

  it("should recognize numbers", function () {
    var test = 5.1;
    expect(TypeUtil.isArray(test)).is.false;
    expect(TypeUtil.isBoolean(test)).is.false;
    expect(TypeUtil.isFunction(test)).is.false;
    expect(TypeUtil.isNumber(test)).is.true;
    expect(TypeUtil.isObject(test)).is.false;
    expect(TypeUtil.isString(test)).is.false;
  });

  it("should recognize arrays", function () {
    var test = [1, 5];
    expect(TypeUtil.isArray(test)).is.true;
    expect(TypeUtil.isBoolean(test)).is.false;
    expect(TypeUtil.isFunction(test)).is.false;
    expect(TypeUtil.isNumber(test)).is.false;
    expect(TypeUtil.isObject(test)).is.false;
    expect(TypeUtil.isString(test)).is.false;
  });

  it("should recognize null as not anything", function () {
    var test = null;
    expect(TypeUtil.isArray(test)).is.false;
    expect(TypeUtil.isBoolean(test)).is.false;
    expect(TypeUtil.isFunction(test)).is.false;
    expect(TypeUtil.isNumber(test)).is.false;
    expect(TypeUtil.isObject(test)).is.false;
    expect(TypeUtil.isString(test)).is.false;
  });

  it("should recognize undefined as not anything", function () {
    var test = undefined;
    expect(TypeUtil.isArray(test)).is.false;
    expect(TypeUtil.isBoolean(test)).is.false;
    expect(TypeUtil.isFunction(test)).is.false;
    expect(TypeUtil.isNumber(test)).is.false;
    expect(TypeUtil.isObject(test)).is.false;
    expect(TypeUtil.isString(test)).is.false;
  });
});
