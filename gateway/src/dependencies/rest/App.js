var express = require('express')
var app = express()
var bodyParser = require('body-parser')

Provider('App', (AuthRoutes, ApiProxyRoutes, AdminRoutes, ContainerRoutes) => {

  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  )
  
  app.use(bodyParser.raw())

  app.use('/isalive', function (req, res) {
    res.status(204).end()
  })

  app.use('/api', ApiProxyRoutes)
  app.use('/admin', bodyParser.json(), AdminRoutes)
  app.use('/containers', bodyParser.json(), ContainerRoutes)
  app.use('/auth', bodyParser.json(), AuthRoutes)

  app.use('*', function (req, res) {
    res.status(404).send({
      message: 'Invalid URL'
    })
  })

  return app
})
