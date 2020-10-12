/* eslint-disable max-len */
module.exports = {
  workspaces: 'resource_type,name,email_domains,is_organization',
  users: 'name,email,photo,workspaces.name,photo',
  projects: 'name,color,created_at,current_status,due_on,members,modified_at,public,start_on,workspace,icon,owner,team',
  tasks: 'name',
};
