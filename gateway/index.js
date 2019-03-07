'use strict'

const AppContext = require('./src/util/AppContext')

require('./app-context')

AppContext
  .scan([
    'src/dependencies'
  ])
  .start((config, Server) => {
    console.log(config)
    console.log(Server)
    Server.start()
  })