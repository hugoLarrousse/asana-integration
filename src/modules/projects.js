const Asana = require('./request/asana');

const get = async (accessToken) => {
  const projects = await Asana.projects(accessToken);
  // format projects
  return projects;
};

exports.get = get;
