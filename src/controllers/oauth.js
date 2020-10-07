const express = require('express');
// const asana = require('../modules/asana');

const logger = require('../utils/logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // send code to asana api to get token and refresh_token --> response to core
  } catch (e) {
    logger.error(__filename, 'oauth', e.message);
    res.status(400).json(e.message);
  }
});

module.exports = router;
