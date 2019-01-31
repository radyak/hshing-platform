module.exports = {

  bootstrap: (configPromise, components) => {
    var currentPromise = configPromise

    for (var i in components) {
      const component = components[i]
      currentPromise = currentPromise
        .then((config) => {
          return require(`./components/${component}`)(config)
            .then(() => {
              console.log(`Component ${component} loaded`)
              return config
            })
        })
        .catch(err => {
          console.log(`Error while loading component ${component}`, err)
          throw err
        })
    }

    currentPromise
      .catch(err => {
        console.error('Error while bootstrapping application', err)
        throw err
      })
  }

}
