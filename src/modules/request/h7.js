// function to communicate with h7
const config = require('config');
const axios = require('axios');
const querystring = require('querystring');

const logger = require('../../utils/logger');

const { fixedToken } = process.env;

const baseUrl = config.get('h7Url');

const requestH7Api = async (method, path, query, headers, data) => {
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
        methodName: 'requestH7Api',
        message: `options: ${JSON.stringify(options)}, error: ${JSON.stringify(response)}`,
      });
      return null;
    }
    if (response && response.status && response.status !== 200) {
      logger.error({
        filename: __filename,
        methodName: 'requestH7Api',
        message: `options: ${JSON.stringify(options)}, response: ${JSON.stringify(response)}`,
      });
      return null;
    }
    return response.data;
  } catch (error) {
    logger.error({
      filename: __filename,
      methodName: 'requestH7Api',
      message: `options: ${JSON.stringify(options)},
      data: ${error.response && JSON.stringify(error.response.data)}
      status: ${error.response && error.response.status}
      headers: ${error.response && JSON.stringify(error.response.headers)}
      message: ${error.message}`,
    });
    return null;
  }
};

const getIntegrations = () => {
  return requestH7Api('GET', '/asana/ms/integrations', null, { Authorization: fixedToken });
};
exports.getIntegrations = getIntegrations;
