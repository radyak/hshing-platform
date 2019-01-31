module.exports = function (config) {
  // if (Env.isTest()) { ...
  return new Promise((resolve, reject) => {
    require('../../persistence/mongodb-connection').then(() => {
      require('../../persistence/model/index')
      resolve(config)
    })
  })
}
