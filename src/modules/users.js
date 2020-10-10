const Asana = require('./request/asana');

const get = async (accessToken) => {
  const users = await Asana.users(accessToken);

  return users.data.filter(user => user.email && user.name).map(user => {
    const [firstname, lastname] = user.name.split(' ');
    return {
      asanaId: user.gid,
      email: user.email,
      firstname,
      lastname,
      photo: user.photo && (user.photo.image_128x128 || user.photo.image_60x60),
    };
  });
};

exports.get = get;
