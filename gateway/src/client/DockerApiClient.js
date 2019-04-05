const request = require('request')

const BASE_URL = 'http://unix:/var/run/docker.sock:/v' + (process.env.DOCKER_API_VERSION || '1.30')


class DockerApiClient {

  request(options) {
    options.url = options.url || `${BASE_URL}${options.path}`
    delete options.path
    options.headers = options.headers || {}
    options.headers.Host = 'localhost'
    return new Promise((resolve, reject) => {
      request(options, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  getAllContainerDetails(onlyRunning = false) {
    let qs = {}
    qs.all = (onlyRunning ? 0 : 1)
    return this.request({
      method: 'GET',
      path: `/containers/json`,
      qs: qs
    })
  }

  getContainerDetails(name) {
    return this.request({
      method: 'GET',
      path: `/containers/${name}/json`
    })
  }

  stopContainer(name) {
    return this.request({
      method: 'POST',
      path: `/containers/${name}/stop`
    })
  }

  startContainer(name) {
    return this.request({
      method: 'POST',
      path: `/containers/${name}/start`
    })
  }

}

module.exports = DockerApiClient
