const Asana = require('./request/asana');

const get = async (accessToken) => {
  const tasks = await Asana.tasks(accessToken);
  // format projects
  return tasks;
};

exports.get = get;
