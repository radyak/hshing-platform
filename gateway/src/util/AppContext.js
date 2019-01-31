var TypeUtil = require('./TypeUtil')

var Context = {}

var AppContext = new Proxy(Context, {
  get (target, name, receiver) {
    var key = name.trim().toLowerCase()
    let rv = Reflect.get(target, key, receiver)
    if (forbiddenToOverrideProperties.indexOf(key) !== -1) {
      return rv
    }

    if (!rv) {
      throw new Error(
        `No component with name '${name}' / key '${key}' present in AppContext`
      )
    }

    if (!TypeUtil.isFunction(rv)) {
      // Not a constructor -> can't be instantiated (any more)
      return rv
    }
    rv = instantiate(rv)
    // AppContext.register(name, rv);
    Context[key] = rv
    return rv
  }
})

var instantiate = function (component) {
  var dependencies = [null]
  var dependencyNames = getArgs(component)
  for (var i in dependencyNames) {
    var dependencyName = dependencyNames[i]
    dependencies.push(AppContext[dependencyName])
  }
  var instace = new (Function.prototype.bind.apply(component, dependencies))()
  return instace
}

AppContext.register = function (name, component) {
  if (forbiddenToOverrideProperties.indexOf(name) !== -1) {
    throw new Error(`Registration with keys ${forbiddenToOverrideProperties.join(', ')} is not allowed`)
  }
  if (!TypeUtil.isString(name) || !name.trim()) {
    throw new Error(
      `Components must be registered with a non-empty name of type *string*, but was tried with ${name} (type: ${typeof name})`
    )
  }
  var key = name.trim().toLowerCase()
  if (Context.hasOwnProperty(name)) {
    console.warn(
      `A component with name '${name}' has already been registered; overwriting it`
    )
  }
  Context[key] = component
}

/**
 * Use to derivate dependencies of a class/function
 *
 * taken from https://davidwalsh.name/javascript-arguments
 */
function getArgs (func) {
  var matches = func.toString().match(/function\s.*?\(([^)]*)\)/)
  if (!matches) {
    // TODO: Unify RegExpressions
    matches = func.toString().match(/constructor\s.*?\(([^)]*)\)/)
  }
  var args = matches ? matches[1] : ''

  return args
    .split(',')
    .map(function (arg) {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim()
    })
    .filter(function (arg) {
      // Ensure no undefined values are added.
      return arg
    })
}

var forbiddenToOverrideProperties = Object.keys(AppContext)

module.exports = AppContext
