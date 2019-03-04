const ConfigService = require('./src/util/ConfigService')
const FileEnvKeyProvider = require('./src/util/FileEnvKeyProvider')
const DynDnsUpdateService = require('./src/service/DynDnsUpdateService')
const Env = require('./src/util/Env')

Dependency('KeyFile', (process.env.CONF_DIR || __dirname) + '/.env.key')

Dependency('ConfigFile', (process.env.CONF_DIR || __dirname) + '/.env.conf')

Dependency('ConfigService', ConfigService)

Dependency('KeyProvider', FileEnvKeyProvider)

Dependency('config', (ConfigService) => {
  return ConfigService.getConfig()
})

Provider('Main', (config, Server) => {
  Server.start()
  console.log('Server started')
})

Provider('DynDnsComponent', (config) => {
  if (Env.isProd()) {
    // return new DynDnsUpdateService(config).updateCyclic()
    return new DynDnsUpdateService(config)
  }
})

Provider('MongoDBConnection', (config) => {
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


// Provider('OAuthModel', (MongoDBConnection) => {
//   require('./src/persistence/model/index')
// })

Provider('OAuthClients', (MongoDBConnection) => {
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  return mongoose.model('OAuthClients', new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array },
    grants: { type: Array }
  }))
})


Provider('OAuthTokens', (MongoDBConnection) => {
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  return mongoose.model('OAuthTokens', new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client: { type: Object }, // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresOn: { type: Date },
    user: { type: Object },
    userId: { type: String }
  }))
})

Provider('OAuthUsers', (MongoDBConnection) => {
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema
  
  return mongoose.model('OAuthUsers', new Schema({
    email: {
      type: String,
      min: [10, 'Email is too short'],
      max: [99, 'Email is too long'],
      required: [true, 'Email is required'],
      match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
      type: String,
      min: [10, 'Password is too short'],
      max: [99, 'Password is too long'],
      required: [true, 'Password is required']
    },
    username: {
      type: String,
      min: [10, 'Username is too short'],
      max: [24, 'Username is too long'],
      required: [true, 'Username is required']
    }
  }))
})

Provider('OAuthAuthorizationCodes', (MongoDBConnection) => {
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  return mongoose.model('OAuthAuthorizationCodes', new Schema({
    authorization_code: { type: String },
    expiresAt: { type: Date },
    redirectUri: { type: String },
    scope: { type: String },
    clientId: { type: String },
    userId: { type: String }
  }))
})



Provider('PasswordHashService', () => {
  const PasswordHashService = require('./src/service/PasswordHashService')
  return PasswordHashService
})

Provider('TokenService', (OAuthTokens) => {
  const TokenService = require('./src/service/TokenService')
  return new TokenService(OAuthTokens)
})

Provider('AuthorizationCodeService', (OAuthAuthorizationCodes) => {
  const AuthorizationCodeService = require('./src/service/AuthorizationCodeService')
  return new AuthorizationCodeService(OAuthAuthorizationCodes)
})

Provider('UserService', (OAuthUsers, PasswordHashService) => {
  const UserService = require('./src/service/UserService')
  return new UserService(OAuthUsers, PasswordHashService)
})

Provider('ClientsService', (OAuthClients) => {
  const ClientsService = require('./src/service/ClientsService')
  return new ClientsService(OAuthClients)
})

Provider('AuthService', (ClientsService, TokenService, UserService, AuthorizationCodeService) => {
  const AuthService = require('./src/service/AuthService')
  return new AuthService(TokenService, ClientsService, UserService, AuthorizationCodeService)
})

Provider('OAuthServer', (AuthService) => {
  const OAuthServer = require('express-oauth-server')
  // See https://github.com/oauthjs/node-oauth2-server for specification
  return new OAuthServer({
    debug: true,
    model: AuthService
  })
})

Provider('AuthRouteConfig', (OAuthServer, ClientsService, UserService) => {
  var express = require('express')
  var router = express.Router()

  router.post('/clients', (req, res) => {
    var clientInfo = req.body

    // TODO: which fields must be generated?
    ClientsService.createClient(
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

Provider('App', (ConfigService, AuthRouteConfig) => {

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

  app.use('/auth', bodyParser.json(), AuthRouteConfig)

  app.use('*', function (req, res) {
    res.status(404).send({
      message: 'Invalid URL'
    })
  })

  return app
})

Provider('Server', (config, App) => {
  const greenlock = require('greenlock-express')

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
