/* eslint-disable max-len */
module.exports = {
  workspaces: 'resource_type,name,email_domains,is_organization',
  users: 'name,email,photo,workspaces.name,photo',
  projects: 'name,color,created_at,current_status,due_on,members,modified_at,public,start_on,workspace,icon,owner,team',
  tasks: 'name,completed,completed_at,completed_by,created_at,due_at,due_on,modified_at,num_likes,start_on,assignee,parent,workspace',
};
