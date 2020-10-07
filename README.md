# asana-integration
custom integration asana api

## Stack
- nodeJS
- mongoDB
- express

## TO DO
- [ ] oauth 2.0
- [ ] get & store **workspaces**
- [ ] get & store **users**
- [ ] get & store **projects**
- [ ] get & store **tasks**

- create the API to communicate with the integration
  - [ ] consume oauth
  - [ ] sync data
  - [ ] send data to core
- [ ] format data for core

Should we store then format + store or only format + store?

## Routes

- post oauth: Core --> Me --> Asana APi --> Core
- post sync: Core --> Me --> Asana APi --> Core
- get token (oauth): Core --> Me --> Asana APi --> Core
- get workspaces/users/projects/tasks: Me --> Asana API
