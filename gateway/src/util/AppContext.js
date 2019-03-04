var TypeUtil = require('./TypeUtil')
var FunctionUtil = require('./FunctionUtil')

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
      // Not a function/constructor -> can't be instantiated (any more)
      return rv
    }
    rv = instantiate(rv)
    // AppContext.register(name, rv);
    Context[key] = rv
    return rv
  }
})

var instantiate = function (component) {
  var dependencies = []
  var dependencyNames = FunctionUtil.getFunctionParameters(component)
  for (var i in dependencyNames) {
    var dependencyName = dependencyNames[i]
    dependencies.push(AppContext[dependencyName])
  }
  var instance

  try {
    instance = component.apply(null, dependencies)
  } catch (e) {
    // TODO: should e.message be checked for "Class constructor SolarPanel cannot be invoked without 'new'"?
    // console.error(e.message)
  }

  if (instance === undefined) {
    try {
      instance = new (Function.prototype.bind.apply(component, [null, ...dependencies]))()
    } catch (e) {
      // TODO: should e.message be checked for "Function.prototype.bind.apply(...) is not a constructor"?
      // console.error(e.message)
    }
  }

  return instance
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

AppContext.provider = function (name, providerFunction) {
  var dependencyNames = FunctionUtil.getFunctionParameters(providerFunction)

  AppContext.register(name, () => {
    var dependencies = []
    for (var i in dependencyNames) {
      var dependencyName = dependencyNames[i]
      dependencies[i] = AppContext[dependencyName]
    }
    return Promise.all(dependencies).then(values => {
      return providerFunction.apply(null, values)
    })
  })
}

var forbiddenToOverrideProperties = Object.keys(AppContext)

module.exports = AppContext
