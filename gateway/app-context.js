const ConfigService = require('./src/util/ConfigService')
const FileEnvKeyProvider = require('./src/util/FileEnvKeyProvider')
const AppContext = require('./src/util/AppContext')
const DynDNSUpdater = require('./src/dyndns/DynDNSUpdater')
const Env = require('./src/util/Env')

AppContext.register('KeyFile', (process.env.CONF_DIR || __dirname) + '/.env.key')

AppContext.register('ConfigFile', (process.env.CONF_DIR || __dirname) + '/.env.conf')

AppContext.register('ConfigService', ConfigService)

AppContext.register('KeyProvider', FileEnvKeyProvider)

AppContext.register('config', (ConfigService) => {
  return ConfigService.getConfig()
})

AppContext.register('Main', (config, Server) => {
  return Promise.all([config, Server]).then(values => {
    // console.log('Got config:', values[0])
    // console.log('and OAuthServer:', values[1])
    var Server = values[1]
    console.log('Starting server')
    Server.start()
    console.log('Server started')
  })
})

AppContext.register('DynDnsComponent', (config) => {
  return Promise.all([config]).then(values => {
    config = values[0]
    if (Env.isProd()) {
      // return new DynDNSUpdater(config).updateCyclic()
      return new DynDNSUpdater(config)
    }
  })
})

AppContext.register('MongoDBConnection', (config) => {
  return new Promise((resolve, reject) => {
    var mongoose = require('mongoose')

    // TODO: fetch props from config, not (only) from Env
    const HOST = process.env.MONGO_HOST || 'localhost'
    const PORT = process.env.MONGO_PORT || '27017'
    const DATABASE = process.env.MONGO_DATABASE || 'auth'

    var connectString = `mongodb://${HOST}:${PORT}/${DATABASE}`

    mongoose
      .connect(connectString, { useNewUrlParser: true })
      .then(
        res => {
          console.log(`Successfully connected to ${connectString}`)
          resolve(res)
        },
        err => {
          console.error(`Unable to connected to ${connectString}`, err)
          reject(err)
        }
      )
  })
})

AppContext.register('OAuthModel', (MongoDBConnection) => {
  return Promise.all([MongoDBConnection]).then(() => {
    require('./src/persistence/model/index')
  })
})

AppContext.register('AuthService', (OAuthModel) => {
  return Promise.all([OAuthModel]).then(() => {
    const AuthService = require('./src/service/AuthService')
    return AuthService
  })
})

AppContext.register('OAuthServer', (AuthService) => {
  return Promise.all([AuthService]).then(values => {
    const OAuthServer = require('express-oauth-server')
    var authService = values[0]
    // See https://github.com/oauthjs/node-oauth2-server for specification
    console.log('AuthService=', authService)
    return new OAuthServer({
      debug: true,
      model: authService
    })
  })
})

AppContext.register('AuthRouteConfig', (OAuthServer) => {
  return Promise.all([OAuthServer]).then(values => {
    var OAuthServer = values[0]

    var express = require('express')
    var router = express.Router()
    var ClientService = require('./src/service/ClientService')
    var UserService = require('./src/service/UserService')

    router.post('/clients', (req, res) => {
      var clientInfo = req.body

      // TODO: which fields must be generated?
      ClientService.createClient(
        clientInfo.clientId,
        clientInfo.redirectUris,
        clientInfo.grants
      )
        .then((client) => {
          res.status(200).send(client)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    })

    router.post('/users', (req, res) => {
      var registration = req.body

      UserService.createUser(
        registration.username,
        registration.email,
        registration.password,
        registration.passwordRepeat
      )
        .then((user) => {
          res.status(200).send(user)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    })

    router.use('/token', OAuthServer.token())
    router.use('/authorize', OAuthServer.authorize())

    return router
  })
})

AppContext.register('App', (ConfigService, AuthRouteConfig) => {
  return Promise.all([ConfigService, AuthRouteConfig]).then(values => {
    const ConfigService = values[0]
    const AuthRouteConfig = values[1]

    var express = require('express')
    var app = express()
    var bodyParser = require('body-parser')
    var DockerContainerService = require('./src/service/DockerContainerService')

    app.use(
      bodyParser.urlencoded({
        extended: false
      })
    )
    app.use(bodyParser.raw())

    app.use('/isalive', function (req, res) {
      res.status(204).end()
    })

    // proxy requires bodyParser.raw()!
    app.use('/api', require('./src/rest/api-proxy'))

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

    app.use('/auth', bodyParser.json(), AuthRouteConfig)

    app.use('*', function (req, res) {
      res.status(404).send({
        message: 'Invalid URL'
      })
    })

    return app
  })
})

AppContext.register('Server', (config, App) => {
  return Promise.all([config, App]).then(values => {
    const greenlock = require('greenlock-express')
    const config = values[0]
    const App = values[1]

    if (Env.isProd()) {
      var server = greenlock.create({
        version: 'draft-11',
        server: 'https://acme-v02.api.letsencrypt.org/directory',
        configDir: '~/.config/acme/',
        email: config.admin.email,
        approvedDomains: [config.hostDomain],
        agreeTos: true,
        app: App,
        communityMember: true,
        telemetry: false
      })
      // .listen(80, 443)
      return {
        start: () => {
          server.listen(80, 443)
        }
      }
    } else {
      console.log('Using unsecured HTTP traffic - FOR DEVELOPMENT ONLY')
      return {
        start: () => {
          App.listen(80)
        }
      }
    }
  })
})
