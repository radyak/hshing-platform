# Open Issues

## Minor

- Use `request` for `DynNSUpdater` instead of `simple-get`

## App Management

- Develop an _App management_ (container/stack management)
- Develop concept for app stacks
- Develop an own MongoDB ARM32 image

## Bootstrap

- Use _Context Profiles_
- _Start Docker Swarm_ on machine startup
- Develop routine for _first startup_ of unconfigured cluster
  - Set up root user in database
  - Generate config key on first startup (see also *Security & Configuration*)
  - Require an validated main configuration before server start
- _Automatic port forwardings_ on connected router (Problem: Docker uses its own default gateway, not directly the router)

## Misc

- Use App-Information (port, required roles etc.) for proxying requests
- _Tests_ (use Mock MongoDB)
- _Validations_/central model

## Security & Configuration

- Develop rock-solid _management for config & secrets_ (Docker Swarm?)
  - Encryption key?
  - MongoDB credentials (per database and/or multitenancy)
- Perform a security audit (see https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d)
- Develop a bullet-proof concept of encryption
- Secure MongoDB

## Documentation

- Add/complete _JsDoc_
- _Extend Docs_, add diagrams for most important flows

