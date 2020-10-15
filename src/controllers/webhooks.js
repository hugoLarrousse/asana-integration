// need to check asana API webhooks
const express = require('express');
const Webhooks = require('../modules/webhooks');

const logger = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TO BE CONFIGURED
  } catch (e) {
    logger.error(__filename, 'webhooks', e.message);
    res.status(400).json(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    // refresh token
    const { filters, resource, target } = req.body;
    if (!filters || !resource || !target) throw Error('wrong body');
    res.status(200).send({ success: true, data: await Webhooks.post(req.query.accessToken, filters, resource, target) });
  } catch (e) {
    logger.error(__filename, 'post webhooks', e.message);
    res.status(400).json(e.message);
  }
});

module.exports = router;
