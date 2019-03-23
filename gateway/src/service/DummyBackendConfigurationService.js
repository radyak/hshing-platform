var config = {
    "test1": {
        "host": "test-app",
        "port": 3210
    },
    "test2": {
        "host": "portainer",
        "port": 9000
    },
    "mongoclient": { }
}

class DummyBackendConfigurationService {

    getBackendConfiguration(name) {
        const backendConfig = config[name];
        if (!backendConfig) {
            throw new Error(`No service with name ${name} registered`)
        }
        return backendConfig
    }

    registerBackend(name, config) {
        // TODO: Add more detailed validations
        if (!name) {
            throw new Error(`Cannot register backend - name '${name}' is invalid`)
        }
        if (!config) {
            throw new Error(`Cannot register backend '${name}' - config is invalid`)
        }
        if (config[name]) {
            throw new Error(`Cannot register backend '${name}' - already registered`)
        }
        config[name] = config
    }

    unregisterBackend(name) {
        // TODO: Add more detailed validations
        if (!name) {
            throw new Error(`Cannot unregister backend - name '${name}' is invalid`)
        }
        if (!config[name]) {
            throw new Error(`Cannot unregister backend '${name}' - was not registered yet`)
        }
        delete config[name]
    }

}

module.exports = DummyBackendConfigurationService