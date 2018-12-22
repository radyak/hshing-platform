var TypeUtil = require("./TypeUtil");

var Context = {};

var AppContext = new Proxy(Context, {
  get(target, name, receiver) {
    let rv = Reflect.get(target, name, receiver);

    if (!rv) {
      throw new Error(`No component with name ${name} present in AppContext`);
    }
    // Do the magic here
    return rv;
  }
});

AppContext.register = function(name, component) {
  if (!TypeUtil.isString(name) || !name.trim()) {
    throw new Error(
      `Components must be registered with a non-empty name of type *string*, but was tried with ${name} (type: ${typeof name})`
    );
  }
  var key = name.trim();
  if (Context.hasOwnProperty(name)) {
    console.warn(
      `A component with name '${name}' has already been registered; overwriting it`
    );
  }
  Context[key] = component;
};

/**
 * Use to derivate dependencies of a class/function
 *
 * taken from https://davidwalsh.name/javascript-arguments
 */
function getArgs(func) {
  // First match everything inside the function argument parens.
  var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

  // Split the arguments string into an array comma delimited.
  return args
    .split(",")
    .map(function(arg) {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, "").trim();
    })
    .filter(function(arg) {
      // Ensure no undefined values are added.
      return arg;
    });
}

module.exports = AppContext;
