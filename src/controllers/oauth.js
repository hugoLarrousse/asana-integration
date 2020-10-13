const express = require('express');
const authentication = require('../modules/authentication');

const logger = require('../utils/logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!req.body.code) throw Error('no code provided');

    const tokenData = await authentication.getAccessToken(req.body.code);

    res.status(200).send({ success: true, data: tokenData });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'post /oauth', message: e.message });
    res.status(400).json({ success: false, message: e.message });
  }
});

// Shouldn't be used
router.post('/refresh', async (req, res) => {
  try {
    if (!req.body.refreshToken) throw Error('no refresh token provided');
    res.status(200).send({ success: true, data: await authentication.refreshAccessToken(req.body.refreshToken) });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'post /oauth/refresh', message: e.message });
    res.status(400).json({ success: false, message: e.message });
  }
});

module.exports = router;
