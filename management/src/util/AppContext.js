var Context = {};

var register = function(name, component) {
  if (typeof name !== "string" || !name.trim()) {
    throw new Error(
      `Components must be registered with a non-empty name of type *string*, but was tried with ${name} (type: ${typeof name})`
    );
  }
  if (Context.hasOwnProperty(name)) {
    console.warn(
      `A component with name '${name}' has already been registered; overwriting it`
    );
  }
  Context[name.trim()] = component;
};

var get = function(name) {
  if (!Context.hasOwnProperty(name)) {
    throw new Error(`No component with name ${name} present in AppContext`);
  }
  return Context[name];
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

module.exports = {
  register: register,
  get: get
};
