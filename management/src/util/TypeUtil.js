var TypeUtil = {
  isBoolean: function(test) {
    return typeof test === "boolean";
  },
  isFunction: function(test) {
    return typeof test === "function";
  },
  isNumber: function(test) {
    return typeof test === "number";
  },
  isString: function(test) {
    return typeof test === "string";
  },
  isObject: function(test) {
    return test != null && typeof test === "object";
  }
};

module.exports = TypeUtil;
