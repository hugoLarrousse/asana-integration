const { CronJob } = require('cron');
const logger = require('../utils/logger');
const Tasks = require('./tasks');

const h7APi = require('./request/h7');

const SEVEN_MINUTES_IN_MS = 420000;

const job = new CronJob('*/3 * * * *', async () => {
  try {
    console.time('cron');
    console.log('\x1b[32m%s\x1b[0m', '*** START CRON ***');
    const { data: integrations } = await h7APi.getIntegrations();

    if (!integrations) throw Error('no integrations found');
    for (const integration of integrations) {
      console.log('email', integration.users[0].email);
      const { accessToken, users, workspaces } = integration;
      if (!accessToken || !users || !workspaces) {
        logger.error({ filename: __filename, methodName: 'cron in int', message: `something is missing: ${JSON.stringify(integration)}` });
        continue;
      }
      const tasks = await Tasks.getByUsers(accessToken, users, workspaces, new Date(Date.now() - SEVEN_MINUTES_IN_MS).toISOString());

      if (tasks) {
        await h7APi.sendTasks({ orgaId: integration.orgaId, tasks });
      }
    }
    console.timeEnd('cron');
    console.log('\x1b[32m%s\x1b[0m', '***END CRON***\n');
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'cron', message: `${e.message} ${new Date()}` });
  }
});

const recurrentData = () => job.start();
const stopJob = () => job.stop();

exports.recurrentData = recurrentData;
exports.stopJob = stopJob;
