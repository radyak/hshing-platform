'use strict'

const AppContext = require('./src/util/AppContext')

global.AppContext = AppContext
global.Dependency = AppContext.register
global.Provider = AppContext.provider

require('./app-context')

AppContext.Main.then(() => {
  console.log(`Application started`)
})
