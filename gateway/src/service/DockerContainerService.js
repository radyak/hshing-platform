const request = require('request')

const DockerContainerService = {

  getContainers: () => {
    return new Promise((resolve, reject) => {
      var options = {
        url: 'http://unix:/var/run/docker.sock:/v1.39/containers/json',
        headers: {
          'Host': 'localhost'
        }
      }
      request.get(options, (err, res, body) => {
        if (err) {
          reject(err)
          return
        }
        resolve(body)
      })
    })
  }

}

module.exports = DockerContainerService
