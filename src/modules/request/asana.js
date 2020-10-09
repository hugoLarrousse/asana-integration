// function to communicate with asana
const config = require('config');
const axios = require('axios');
const querystring = require('querystring');

const logger = require('../../utils/logger');

const clientId = process.env.asanaClientId;
const clientSecret = process.env.asanaClientSecret;
const redirectUri = process.env.asanaRedirectUri;

const { baseUrl, oauthTokenPath, usersPath } = config.get('asanaApi');

const requestAsanaApi = async (method, path, query, headers, data) => {
  const options = {
    method,
    url: `${baseUrl}${path || ''}${query ? `?${query}` : ''}`,
    ...(headers && { headers }),
    ...(data && { data: querystring.stringify(data) }),
  };
  try {
    const response = await axios(options);

    if (!response || !response.data) {
      logger.error({
        filename: __filename,
        methodName: 'requestAsanaApi',
        message: `options: ${JSON.stringify(options)}, error: ${JSON.stringify(response)}`,
      });
      return null;
    }
    if (response && response.status && response.status !== 200) {
      logger.error({
        filename: __filename,
        methodName: 'requestAsanaApi',
        message: `options: ${JSON.stringify(options)}, response: ${JSON.stringify(response)}`,
      });
      return null;
    }
    return response.data;
  } catch (error) {
    logger.error({
      filename: __filename,
      methodName: 'requestAsanaApi',
      message: `options: ${JSON.stringify(options)},
      data: ${error.response && error.response.data}
      status: ${error.response && error.response.status}
      headers: ${error.response && error.response.headers}
      message: ${error.message}}`,
    });
    return null;
  }
};

const oauthToken = (code) => {
  const data = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  };
  return requestAsanaApi('POST', oauthTokenPath, null, null, data);
};

const refreshAccessToken = (refreshToken) => {
  const data = {
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    refresh_token: refreshToken,
  };
  return requestAsanaApi('POST', oauthTokenPath, null, null, data);
};

const users = (accessToken) => {
  return requestAsanaApi('GET', `${usersPath}?opt_fields=name,email,photo,workspaces.name`, null, { Authorization: `Bearer ${accessToken}` });
};

exports.oauthToken = oauthToken;
exports.refreshAccessToken = refreshAccessToken;
exports.users = users;