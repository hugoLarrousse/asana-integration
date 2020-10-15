const Asana = require('./request/asana');

const post = async (accessToken, filters, resource, target) => {
  await Asana.postWebhook(accessToken, {
    data: {
      filters,
      resource,
      target,
    },
  });
};

exports.post = post;
