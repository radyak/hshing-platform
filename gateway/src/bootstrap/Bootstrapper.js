module.exports = {

    bootstrap: (configPromise, components) => {

        var currentPromise = configPromise;

        for (var i in components) {
            const component = components[i];
            currentPromise = currentPromise
                .then((config) => {
                    console.log("Loading " + component);
                    return require(`./components/${component}`)(config)
                    .then(() => {return config});
                });
        }

        currentPromise
            .catch(err => {
                console.error("Error while bootstrapping application", err);
                throw err;
            });

    }

};