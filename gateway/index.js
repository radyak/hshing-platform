const AppContext = require('./src/util/AppContext')

AppContext
  .scan([
    'src/dependencies'
  ])
  .start((config, Server) => {
    console.log(config)
    console.log(Server)
    Server.start()
  })