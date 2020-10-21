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

  return workspaces.reduce((prev, curr) => {
    const usersInWorkspaces = users.filter(user => user.workspaces.includes(curr));
    if (prev[curr]) {
      prev[curr].push(...usersInWorkspaces);
    } else {
      prev[curr] = usersInWorkspaces; // eslint-disable-line no-param-reassign
    }
    return prev;
  }, {});
};

const formatToGetTasks = (workspaces, usersByWorkspaces) => {
  const users = [];
  for (const workspace of workspaces.split(',')) {
    for (const user of usersByWorkspaces[workspace].split(',')) {
      const index = users.findIndex(a => a.id === user);
      if (index === -1) {
        users.push({ id: user, workspaces: [workspace] });
      } else {
        users[index].workspaces.push(workspace);
      }
    }
  }
  return users;
};

exports.get = get;
exports.getByWorkspaces = getByWorkspaces;
exports.formatToGetTasks = formatToGetTasks;
