const request = require('request')

const BASE_URL = 'http://unix:/var/run/docker.sock:/v' + (process.env.DOCKER_API_VERSION || '1.30')


class DockerContainerClient {

  request(options) {
    options.url = options.url || `${BASE_URL}${options.path}`
    delete options.path
    return new Promise((resolve, reject) => {
      request(options, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  getAllContainerDetails() {
    return this.request({
      method: 'GET',
      path: `/containers/json`,
      headers: {
        'Host': 'localhost'
      }
    })
  }

  getContainerDetails(name) {
    return this.request({
      method: 'GET',
      path: `/containers/${name}/json`,
      headers: {
        'Host': 'localhost'
      }
    })
  }

  stopContainer(name) {
    return this.request({
      method: 'POST',
      path: `/containers/${name}/stop`,
      headers: {
        'Host': 'localhost'
      }
    })
  }

  startContainer(name) {
    return this.request({
      method: 'POST',
      path: `/containers/${name}/start`,
      headers: {
        'Host': 'localhost'
      }
    })
  }

}

module.exports = DockerContainerClient
