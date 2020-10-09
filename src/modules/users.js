const Asana = require('./request/asana');

const get = async (accessToken) => {
  const users = await Asana.users(accessToken);
  // format
  return users;
};

exports.get = get;
