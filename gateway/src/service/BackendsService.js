
const indicatorMap = {
    running: "green",
    exited: "orange",
    dead: "red"
}

class BackendsService {

    constructor(BackendConfigurationService, DockerApiClient) {
        this.BackendConfigurationService = BackendConfigurationService
        this.DockerApiClient = DockerApiClient
    }

    getAll() {
        return this.DockerApiClient.getAllContainerDetails().then((res) => {
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
        return this.DockerApiClient.getContainerDetails(backendName).then((res) => {

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
        return this.DockerApiClient.startContainer(backendName).then((res) => {
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
        return this.DockerApiClient.stopContainer(backendName).then((res) => {
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
        var name = raw.Name.substring(1)
        return {
            created: raw.Created,
            status: {
                state: raw.State.Status,
                indicator: indicatorMap[raw.State.Status] || "gray",
                date: raw.State.StartedAt > raw.State.FinishedAt ? raw.State.StartedAt : raw.State.FinishedAt
            },
            description: metaInformation.description,
            label: metaInformation.label,
            name: name,
            entry: metaInformation.entry !== undefined ? `/api/${name}/${metaInformation.entry}` : undefined
        }
    }

    mapAllContainerData(raw, showUnknown = false) {
        raw = JSON.parse(raw)
        var result = []
        for (let container of raw) {
            let name = container.Names[0].substring(1)
            let metaInformation = this.BackendConfigurationService.getBackendConfiguration(name)
            if (metaInformation) {
                result.push({
                    status: {
                        state: container.State,
                        indicator: indicatorMap[container.State] || "gray"
                    },
                    name: name,
                    description: metaInformation.description,
                    label: metaInformation.label
                })
            } else if (showUnknown) {
                result.push({
                    status: {
                        state: container.State,
                        indicator: indicatorMap[container.State] || "gray"
                    },
                    name: name,
                    description: 'n/a',
                    label: name
                })
            }
        }
        return result
    }


}

module.exports = BackendsService
