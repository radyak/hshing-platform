var TypeUtil = require('./TypeUtil')
var FunctionUtil = require('./FunctionUtil')
var FileUtil = require('./FileUtil')
var path = require('path')

var Context = {}
var baseComponents = []
var scanDirs = []

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
    Context[key] = rv
    return rv
  }
})

var instantiate = function (component) {
  var dependencies = []
  var dependencyNames = FunctionUtil.getFunctionParameters(component)
  for (var dependencyName of dependencyNames) {
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
    return resolveThenCallback(dependencyNames, providerFunction)
  })
}

AppContext.components = function (components) {
  for (var component of components) {
    if (TypeUtil.isString(component)) {
      baseComponents.push(component)
    } else {
      console.error(`Base components need to be configured as string! Specified was ${typeof component}`)
    }
  }

  return AppContext
}

var resolveThenCallback = function(dependencyNames, callback) {
  var dependencies = []
  for (var dependencyName of dependencyNames) {
    dependencies.push(AppContext[dependencyName])
  }
  return Promise.all(dependencies).then(values => {
    return callback.apply(null, values)
  })
}

var scanDependencies = function () {
  var filesToScan = []
  for (var scanDir of scanDirs) {
    filesToScan = filesToScan.concat(FileUtil.listFilesRecursively(scanDir))
  }
  console.log(`Scanning following files for dependencies:`, filesToScan)

  for (var file of filesToScan) {
    require(path.resolve('.', file))
  }
}

AppContext.start = function (callback) {
  scanDependencies()
  AppContext.provider('Main', callback)
  AppContext.Main
}

AppContext.scan = function (directories) {
  if (TypeUtil.isArray(directories)) {
    scanDirs = scanDirs.concat(directories)
  } else {
    for (var argument of arguments) {
      scanDirs.push(argument)
    }
  }
  return AppContext
}

const forbiddenToOverrideProperties = Object.keys(AppContext)

global.AppContext = AppContext
global.Dependency = AppContext.register
global.Provider = AppContext.provider
global.Configuration = AppContext.provider

module.exports = AppContext
