const express = require('express');
// const asana = require('../modules/asana');

const logger = require('../utils/logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // refresh token + get data + (store data + format data)? + response data to core
  } catch (e) {
    logger.error(__filename, 'sync', e.message);
    res.status(400).json(e.message);
  }
});

module.exports = router;
