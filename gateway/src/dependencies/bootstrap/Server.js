const greenlock = require('greenlock-express')

Provider('Server', (config, App) => {
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

  return {
    start: () => {
      server.listen(80, 443)
      console.log(`Listening on ports 80, 443`)
    }
  }
})


Provider('Server', (config, App) => {
  console.log('Using unsecured HTTP traffic - FOR DEVELOPMENT ONLY')
  return {
    start: () => {
      var port = process.env.PORT || 80
      App.listen(port)
      console.log(`Listening on port ${port}`)
    }
  }
}, 'dev')
