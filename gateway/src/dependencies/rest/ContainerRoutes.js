var express = require('express')
var router = express.Router()

Configuration('ContainerRoutes', (DockerContainerService) => {

  router.get('/', (req, res) => {
    DockerContainerService.getContainers().then((containers) => {
      res.status(200).send(containers)
    })
  })

  return router
})
