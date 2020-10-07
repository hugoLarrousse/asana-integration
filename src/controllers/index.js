const express = require('express');

const middleware = require('../utils/middleware');

const oauthController = require('./oauth');
const syncController = require('./sync');
const webhooksController = require('./webhooks');

const router = express.Router();

router.use('/webhooks', webhooksController);

router.use('/', middleware.verifyFixedToken);

router.use('/oauth', oauthController);
router.use('/sync', syncController);

module.exports = router;
