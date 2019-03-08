const DynDnsUpdateService = require('../../service/DynDnsUpdateService')

Provider('DynDns', (Env, config) => {
    if (Env.isProd()) {
      return new DynDnsUpdateService(config).updateCyclic()
    }
    console.log('Environment is not production; no DynDNS required')
})