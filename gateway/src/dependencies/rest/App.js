var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var DockerContainerService = require('../../service/DockerContainerService')


Provider('App', (ConfigService, AuthRoutes) => {
  
    app.use(
      bodyParser.urlencoded({
        extended: false
      })
    )
    app.use(bodyParser.raw())
  
    app.use('/isalive', function (req, res) {
      res.status(204).end()
    })
  
  
    
    // Works with greenlock-express out-of-the-box
    // TODO: check is proxy requires bodyParser.raw()
    var proxy = require('http-proxy-middleware')
    const DEFAULT_PORT = 3000
    app.use('/api', proxy('/api/**', {
  
      // Overwrites `target`
      router: function (message) {
        var regex = new RegExp('/api/([a-zA-Z.-]*)/*(.*)', 'i')
        var matches = regex.exec(message.url)
        var host = matches[1]
        var backendUrl = `http://${host}:${DEFAULT_PORT}`
        return backendUrl
      },
    
      // Default target
      target: 'http://nirvana:3000',
    
      changeOrigin: true,
    
      ws: true,
    
      // Remove base path
      pathRewrite: {
        '^/api/[a-zA-Z0-9.-]*/': ''
      },
    
      onError: function (err, req, res) {
        console.error('An error occurred while proxying request; request:', req, 'error:', err)
    
        res.writeHead(502, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
          'message': 'Bad Gateway'
        }))
      }
    
    }))
  
  
    
    app.get('/admin/config', bodyParser.json(), (req, res) => {
      ConfigService.getConfigSecure().then(config => {
        res.status(200).send(config)
      })
    })
  
    app.get('/containers', bodyParser.json(), (req, res) => {
      DockerContainerService.getContainers().then((containers) => {
        res.status(200).send(containers)
      })
    })
  
    app.use('/auth', bodyParser.json(), AuthRoutes)
  
    app.use('*', function (req, res) {
      res.status(404).send({
        message: 'Invalid URL'
      })
    })
  
    return app

})