const greenlock = require('greenlock-express')

Provider('Server', (Env, config, App) => {
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
