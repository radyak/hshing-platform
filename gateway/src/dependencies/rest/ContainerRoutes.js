var express = require('express')
var router = express.Router()


Configuration('ContainerRoutes', (DockerContainerClient, BackendsService) => {


  router.get('/', (request, response) => {
    BackendsService.getAll().then((containers) => {
      response.status(200).send(containers)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.get('/:name', (request, response) => {
    const name = request.params.name
    BackendsService.get(name).then((container) => {
      if (!container) {
        response.status(404).send({
          message: `Container ${name} not found`
        })
        return
      }
      response.status(200).send(container)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name/stop', (request, response) => {
    const name = request.params.name
    BackendsService.stop(name).then((container) => {
      if (container === null) {
        response.status(404).send({
          message: `Container ${name} not found`
        })
        return
      }
      response.status(200).send(container)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name/start', (request, response) => {
    const name = request.params.name
    BackendsService.start(name).then((container) => {
      if (container === null) {
        response.status(404).send({
          message: `Container ${name} not found`
        })
        return
      }
      response.status(200).send(container)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name/remove', (request, response) => {
    const name = request.params.name
    BackendsService.remove(name).then((container) => {
      if (container === null) {
        response.status(404).send({
          message: `Container ${name} not found`
        })
        return
      }
      response.status(200).send(container)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  return router
})
