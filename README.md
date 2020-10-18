# asana-integration

custom integration asana api

## Stack

- nodeJS
- mongoDB
- express

## TO DO

- [x] oauth 2.0
- [x] get & store **workspaces**
- [x] get & store **users**
- [x] get & store **projects**
- [x] get & store **tasks**

- create the API to communicate with the integration
  - [x] consume oauth
  - [x] sync data
  - [x] send data to core
- [ ] format data for core

Should we store then format + store or only format + store?

## Routes

- post oauth: Core --> Me --> Asana APi --> Core
- post sync: Core --> Me --> Asana APi --> Core
- get token (oauth): Core --> Me --> Asana APi --> Core
- get workspaces/users/projects/tasks: Me --> Asana API
- webhooks: Asana API --> Me --> Core (or Asana API --> Me --> Core --> Core)
