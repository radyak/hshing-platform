# _Home Sweet Host &copy;_ - Main Platform

The Management Platform clusters the core functionality of a _Home Sweet Host &copy;_. It is separated into the components

- Management
- Persistence

## Component _Management_

The main roles it serves as are:

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
- [ ] Require an main configuration before _Management_ server start
  - [x] encrypted
  - [ ] validated
- [ ] Use a global context to manage subcomponents
- [ ] Use _core components_:
  - [ ] Persistence: _MongoDB_
  - [ ] Container management: _Portainer_
- [ ] _Start docker-compose_ on machine startup
- [ ] _Automatic port forwardings_ on connected router (UPnP? TR-069?)
