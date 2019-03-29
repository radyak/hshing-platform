var express = require('express')
var router = express.Router()
var RestEvent = require('../../service/model/RestEvent')


Configuration('ContainerRoutes', (DockerContainerClient) => {

  router.get('/', (request, response) => {
    DockerContainerClient.getAllContainerDetails().then((res) => {
      var event = new RestEvent(res)
      event
        .onNotFound(() => {
          response.status(404).send({message: `Container ${name} not found`})
        })
        .onServerError((err) => {
          response.status(500).send({
            message: `An error occurred`,
            error: err
          })
        })
        .default(() => {
          response.status(200).send(res.body)
        })
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.get('/:name', (request, response) => {
    const name = request.params.name
    DockerContainerClient.getContainerDetails(name).then((res) => {
      var event = new RestEvent(res)
      event
        .onNotFound(() => {
          response.status(404).send({message: `Container ${name} not found`})
        })
        .onServerError((err) => {
          response.status(500).send({
            message: `An error occurred`,
            error: err
          })
        })
        .default(() => {
          response.status(200).send(res.body)
        })
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name/stop', (request, response) => {
    const name = request.params.name
    console.log(`Trying to stop container ${name}`)
    DockerContainerClient.stopContainer(name).then((res) => {
      var event = new RestEvent(res)
      event
        .onNotFound(() => {
          response.status(404).send({message: `Container ${name} not found`})
        })
        .onNotModified(() => {
          response.status(304).send({message: `Container ${name} already stopped`})
        })
        .onServerError((err) => {
          response.status(500).send({
            message: `An error occurred`,
            error: err
          })
        })
        .default(() => {
          response.status(200).send({message: `Container ${name} stopped`})
        })
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name/start', (request, response) => {
    const name = request.params.name
    console.log(`Trying to start container ${name}`)
    DockerContainerClient.startContainer(name).then((res) => {
      var event = new RestEvent(res)
      event
        .onNotFound(() => {
          response.status(404).send({message: `Container ${name} not found`})
        })
        .onNotModified(() => {
          response.status(304).send({message: `Container ${name} already started`})
        })
        .onServerError((err) => {
          response.status(500).send({
            message: `An error occurred`,
            error: err
          })
        })
        .default(() => {
          response.status(200).send({message: `Container ${name} started`})
        })
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  return router
})
