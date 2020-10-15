const Asana = require('./request/asana');

const get = async (accessToken) => {
  const users = await Asana.users(accessToken);

  return users.data.filter(user => user.email && user.name).map(user => {
    const [firstname, lastname] = user.name.split(' ');
    return {
      id: user.gid,
      email: user.email,
      firstname,
      lastname,
      photo: user.photo && (user.photo.image_128x128 || user.photo.image_60x60),
      workspaces: user.workspaces.map(workspace => workspace.gid),
    };
  });
};

const getByWorkspaces = async (accessToken, workspaces) => {
  const users = await get(accessToken);

  return workspaces.reduce((prev, curr, index) => {
    const usersInWorkspaces = users.filter(user => user.workspaces.includes(curr));
    prev[index][curr].push(...usersInWorkspaces);
    return prev;
  }, workspaces.map(w => {
    return { [w]: [] };
  }));
};

exports.get = get;
exports.getByWorkspaces = getByWorkspaces;
