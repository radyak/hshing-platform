
const indicatorMap = {
    running: "green",
    exited: "orange",
    dead: "red"
}

class BackendsService {

    constructor(BackendConfigurationService, DockerContainerClient) {
        this.BackendConfigurationService = BackendConfigurationService
        this.DockerContainerClient = DockerContainerClient
    }

    getAll() {
        return this.DockerContainerClient.getAllContainerDetails().then((res) => {
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            return this.mapAllContainerData(res.body)

        }).catch((err) => {
            console.log(`Error while retrieving details of all containers`, err)
            throw err
        })
    }

    get(backendName) {
        return this.DockerContainerClient.getContainerDetails(backendName).then((res) => {

            if (res.statusCode == 404) {
                return null
            }
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }
            
            return this.mapContainerData(res.body)

        }).catch((err) => {
            console.log(`Error while retrieving details of container ${backendName}:`, err)
            throw err
        })
    }

    start(backendName) {
        return this.DockerContainerClient.startContainer(backendName).then((res) => {
            if (res.statusCode == 404) {
                return null
            }
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            return this.get(backendName)
            
        }).catch((err) => {
            console.log(`Error while starting container ${backendName}:`, err)
            throw err
        })
    }

    stop(backendName) {
        return this.DockerContainerClient.stopContainer(backendName).then((res) => {
            if (res.statusCode == 404) {
                return null
            }
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            return this.get(backendName)
            
        }).catch((err) => {
            console.log(`Error while stopping container ${backendName}:`, err)
            throw err
        })
    }
            



    mapContainerData(raw) {
        raw = JSON.parse(raw)
        let metaInformation = this.BackendConfigurationService.getBackendConfiguration(raw.Name.substring(1)) || {}
        return {
            created: raw.Created,
            status: {
                state: raw.State.Status,
                indicator: indicatorMap[raw.State.Status] || "gray",
                date: raw.State.StartedAt > raw.State.FinishedAt ? raw.State.StartedAt : raw.State.FinishedAt
            },
            description: metaInformation.description,
            label: metaInformation.label,
            name: raw.Name.substring(1)
        }
    }

    mapAllContainerData(raw) {
        raw = JSON.parse(raw)
        var result = []
        for (let container of raw) {
            let name = container.Names[0].substring(1)
            let metaInformation = this.BackendConfigurationService.getBackendConfiguration(name) || {}
            result.push({
                status: {
                    state: container.State,
                    indicator: indicatorMap[container.State] || "gray"
                },
                name: name,
                description: metaInformation.description,
                label: metaInformation.label
            })
        }
        return result
    }


}

module.exports = BackendsService
