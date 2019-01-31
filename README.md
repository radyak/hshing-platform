# _Home Sweet Host &copy;_ - Main Platform

The Main Platform clusters the core functionality of a _Home Sweet Host &copy;_. It is separated into the components

- Gateway
- Persistence

## Component _Gateway_

The main roles it serves as are:

- Network Entrypoint:
  - registering IP at DNS
  - establishing and terminating HTTPS
- API Gateway:
  - routing
  - authN/authZ
  - ...
- Administration platform for
  - installed app containers
  - main configuration
  - ...

## Component _Persistence_

To be done ...

## Required manual setup steps

- Domain Provider: Create a (sub)domain and enable DynDNS for it
- Router: Forward ports 80 and 443 to the _Home Sweet Host &copy;_
- _Home Sweet Host &copy;_: see [Host-Setup](./host/README.md)


<!--
Example mermaid sequence diagram

see https://mermaidjs.github.io/sequenceDiagram.html

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant AppBackend
    participant AuthBackend

    User->>Client: action
    Client->>AppBackend: BackendCall (not authenticated)
    activate AppBackend
    AppBackend->>AppBackend: Check Authentication
    AppBackend->>Client: Response: not authenticated
    deactivate AppBackend
    Client->>User: Display login form

    Note over A,J: A typical interaction
    J->>A: Great!
    deactivate J
```
-->

## ToDos

- [x] Install SSL certificate automatically
- [x] Register domain at DNS provider
- [ ] Require an main configuration before server start
  - [x] encrypted
  - [ ] validated
- [ ] Use a global context to manage subcomponents
- [ ] Use _core components_:
  - [ ] Persistence: _MongoDB_
- [ ] _Start docker-compose_ on machine startup
- [ ] _Automatic port forwardings_ on connected router (UPnP? TR-069?)
- [ ] Standard _formatting_ (Standard JS, https://standardjs.com/)
- [ ] Add/complete _JsDoc_
- [ ] Leverage `AppContext` to bootstrap components
- [ ] _Tests_ (use Mock MongoDB)
- [ ] _Validations_/central model
- [ ] Develop routine for _first startup_ of unconfigured cluster
- [ ] Develop rock-solid _management for config & secrets_ (Docker Swarm?)
- [ ] _App management_ (aka container management; Portainer)
- [ ] _Extend readme_, add diagrams for most important flows