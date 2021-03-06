const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

// const mongo = require('./src/database');
const logger = require('./src/utils/logger');
const errorManager = require('./src/utils/errors');
const cron = require('./src/modules/cron');

const env = config.get('env');
const { port } = process.env || 3010;

/* Middleware */
app.use(helmet());
app.use(bodyParser.json({ limit: '4mb' }));
app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }));
app.use(cors({ origin: '*' /* , credentials: true */ }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use('*', (req, res, next) => {
  res.set('Server', 'CallMeMummy');
  next();
});

app.use('/status', (req, res) => {
  res.status(200).send({ success: true, error: false, message: 'OK' });
});

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/sw.js', (req, res) => res.status(204));

app.use('/', require('./src/controllers'));

app.all('*', (req, res, next) => {
  next(`${__filename}| ${req.method} ${req.originalUrl} | wrong path | No asana here`);
});

app.use(errorManager);

server.listen(port, () => {
  try {
    logger.info(`[${env}] Asana integration is running on ${port}`);
    if (process.env.env !== 'development') {
      cron.recurrentData();
    }
  } catch (e) {
    logger.error(`${e.message}`);
  }
});

const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(sig => {
  process.on(sig, () => {
    cron.stopJob();
    server.close((error) => {
      if (error) {
        logger.error({ filename: __filename, methodName: 'signals', message: error.message });
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  });
});
