const Asana = require('./request/asana');

const get = async (accessToken) => {
  const workspaces = await Asana.workspaces(accessToken);

  return workspaces.data.map(workspace => {
    return {
      id: workspace.gid,
      name: workspace.name,
      emailDomains: workspace.email_domains,
      isOrganization: workspace.is_organization,
    };
  });
};

exports.get = get;
