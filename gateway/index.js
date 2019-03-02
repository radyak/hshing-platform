'use strict'

const AppContext = require('./src/util/AppContext')

require('./app-context')

AppContext.Main.then((status) => {
  console.log(`Started with status ${status}`)
})
