'use strict'

const AppContext = require('./src/util/AppContext')
const Bootstrapper = require('./src/bootstrap/Bootstrapper')

require('./app-context')

AppContext.Main.then((status) => {
  console.log(`Started with status ${status}`)
})

// Bootstrapper.bootstrap(
//   AppContext.configService.getConfig(),
//   [
//     'dyndns',
//     'persistence',
//     'oauth',
//     'server'
//   ]
// )
