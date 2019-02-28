const ConfigService = require('./src/util/ConfigService')
const FileEnvKeyProvider = require('./src/util/FileEnvKeyProvider')
const AppContext = require('./src/util/AppContext')

AppContext.register('keyFile', (process.env.CONF_DIR || __dirname) + '/.env.key')
AppContext.register('configFile', (process.env.CONF_DIR || __dirname) + '/.env.conf')

AppContext.register('configService', ConfigService)
AppContext.register('keyProvider', FileEnvKeyProvider)

AppContext.register('config', (ConfigService) => {
    return ConfigService.getConfig()
})

AppContext.register('Main', (config) => {
    return Promise.all([config]).then(values => {
        console.log('Got config:', values[0])
        return 0
    })
})