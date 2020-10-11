const express = require('express');

const Users = require('../modules/users');
const Workspaces = require('../modules/workspaces');
const Projects = require('../modules/projects');
const Tasks = require('../modules/projects');

const logger = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // refresh token + get data + (store data + format data)? + response data to core
  } catch (e) {
    logger.error(__filename, 'sync', e.message);
    res.status(400).json(e.message);
  }
});

router.get('/workspaces', async (req, res) => {
  try {
    // refresh token
    res.status(200).send({ success: true, data: await Workspaces.get(req.query.accessToken) });
  } catch (e) {
    logger.error(__filename, 'sync /workspaces', e.message);
    res.status(400).json({ success: false, message: e.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    // refresh token
    res.status(200).send({ success: true, data: await Users.get(req.query.accessToken) });
  } catch (e) {
    logger.error(__filename, 'sync /users', e.message);
    res.status(400).json({ success: false, message: e.message });
  }
});

router.get('/projects', async (req, res) => {
  try {
    // refresh token
    res.status(200).send({ success: true, data: await Projects.get(req.query.accessToken) });
  } catch (e) {
    logger.error(__filename, 'sync /users', e.message);
    res.status(400).json({ success: false, message: e.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    // refresh token
    res.status(200).send({ success: true, data: await Tasks.get(req.query.accessToken) });
  } catch (e) {
    logger.error(__filename, 'sync /users', e.message);
    res.status(400).json({ success: false, message: e.message });
  }
});

module.exports = router;
