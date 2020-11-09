const express = require('express');

const Users = require('../modules/users');
const Workspaces = require('../modules/workspaces');
const Projects = require('../modules/projects');
const Tasks = require('../modules/tasks');

const logger = require('../utils/logger');

const router = express.Router();

router.get('/workspaces', async (req, res) => {
  try {
    // refresh token
    res.status(200).send({ success: true, data: await Workspaces.get(req.query.accessToken) });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'get /workspaces', message: e.message });
    res.status(400).json({ success: false, message: 'error get workspaces' });
  }
});

router.get('/workspaces/users', async (req, res) => {
  try {
    const workspaces = req.query.workspaces && req.query.workspaces.split(',');

    if (!workspaces) throw Error('no workspaces ids found');
    // refresh token
    res.status(200).send({ success: true, data: await Users.getByWorkspaces(req.query.accessToken, workspaces) });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'get /workspaces/tasks', message: e.message });
    res.status(400).json({ success: false, message: "error get tasks' workspaces" });
  }
});

// get tasks by users & workspaces
router.post('/workspaces/users/tasks', async (req, res) => {
  try {
    // refresh token
    const { users, workspaces, startDate } = req.body;
    if (!users) throw Error('no users found');
    if (!workspaces) throw Error('no workspaces found');
    if (!startDate) throw Error('no startDate found');

    res.status(200).send({ success: true, data: await Tasks.getByUsers(req.query.accessToken, users, workspaces, startDate) });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'get /workspaces/tasks', message: e.message });
    res.status(400).json({ success: false, message: "error get tasks' workspaces" });
  }
});

router.use('/workspaces/users/tasks/live', async (req, res) => {
  try {
    const { workspaces } = req.query;
    if (!workspaces) throw Error('no workspaces found');

    res.status(200).set({
      connection: 'keep-alive',
      'cache-control': 'no-cache',
      'content-type': 'text/event-stream',
      'X-Accel-Buffering': 'no',
    });

    const users = Users.formatToGetTasks(workspaces, req.query);
    await Tasks.getByUsers(req.query.accessToken, users, workspaces, undefined, res);

    res.write('data:end\n\n');
    res.end();
  } catch (e) {
    logger.error(__filename, 'use /live', `error stream: req.user._id: ${req.user.email} & pollId: ${req.query.pollId}`);
    res.end();
  }
});

router.get('/users', async (req, res) => {
  try {
    // refresh token
    res.status(200).send({ success: true, data: await Users.get(req.query.accessToken) });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'get /users', message: e.message });
    res.status(400).json({ success: false, message: 'error get users' });
  }
});

router.get('/projects', async (req, res) => {
  try {
    // refresh token
    res.status(200).send({ success: true, data: await Projects.get(req.query.accessToken) });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'get /projects', message: e.message });
    res.status(400).json({ success: false, message: 'error get projects' });
  }
});

router.get('/projects/tasks', async (req, res) => {
  try {
    const projects = req.query.projects && req.query.projects.split(',');
    if (!projects) throw Error('no projects ids found');

    // refresh token
    res.status(200).send({ success: true, data: await Tasks.get(req.query.accessToken, projects) });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'get /projects/tasks', message: e.message });
    res.status(400).json({ success: false, message: 'error get tasks' });
  }
});

module.exports = router;
