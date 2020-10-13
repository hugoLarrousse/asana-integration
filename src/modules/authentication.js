const config = require('config');

const Asana = require('./request/asana');

const tokenExpiresIn = config.get('tokenExpiresIn') || 3000000;

const getAccessToken = async (code) => {
  const tokenData = await Asana.oauthToken(code);
  console.log('getAccessToken -> tokenData', tokenData);
  if (!tokenData || !tokenData.access_token || !tokenData.refresh_token) {
    throw Error('tokenData incomplete, some data are missing');
  }
  return {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + tokenExpiresIn,
    refreshToken: tokenData.refresh_token,
    userData: tokenData.data,
  };
};

const refreshAccessToken = async (refreshToken) => {
  const tokenData = await Asana.refreshAccessToken(refreshToken);

  if (!tokenData || !tokenData.access_token) {
    throw Error('fail refresh token, access_token is missing');
  }
  return {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + tokenExpiresIn,
  };
};

exports.getAccessToken = getAccessToken;
exports.refreshAccessToken = refreshAccessToken;
