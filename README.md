# asana-integration

custom integration asana api

## Stack

- nodeJS
- mongoDB
- express
- sse

## TO DO

- [x] oauth 2.0
- [x] get **workspaces**
- [x] get **users**
- [x] get **projects**
- [x] get **tasks**
  - [x] by *projects*
  - [x] by *assignee* & *workspaces*

- [ ] create the API to communicate with the integration
  - [x] consume oauth
  - [x] sync data
  - [x] send data to core
  - [ ] cron
- [x] format data for core

We don't store any data, this package is just a parser between your backend and the asana API

## Routes

- [x] POST **/oauth**: *exchange code for accessToken*
- [x] POST **/oauth/refresh**: *refresh accessToken*
- [x] GET **/sync/workspaces**: *get workspaces*
- [x] GET **/sync/workspaces/users**: *get users by workspaces*
- [x] POST **/sync/workspaces/users/tasks**: *get tasks by users & workspaces*
- [x] USE **/sync/workspaces/users/tasks/live**: *(many tasks) get tasks by users & workspaces*
- [x] GET **/sync/users**: *get all users*
- [x] GET **/sync/projects**: *get all projects*
- [x] GET **/sync/projects/tasks**: *get all tasks by projects*
- [x] POST **/webhooks**: *post a webhook*
