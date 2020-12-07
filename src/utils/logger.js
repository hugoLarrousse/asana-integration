const winston = require('winston');
const SlackHook = require('winston-slack-webhook-transport');

const myFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level} ${message}`);

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: (new Date(), 'DD/MM/YYYY hh:mm:ss') }),
    myFormat,
  ),
});

if (process.env.NODE_ENV === 'production' && process.env.slackWebhookUrl) {
  logger.add(new SlackHook({
    level: 'error',
    webhookUrl: process.env.slackWebhookUrl,
    formatter: error => {
      return {
        //  text: "This will function as a fallback for surfaces that don't support Block Kit, like IRC clients or mobile push notifications.",
        attachments: [{
          type: 'divider',
        },
        {
          color: '#ff0000',
          blocks: [{
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `\n${error.filename || 'no filename'}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `\n${error.methodName || 'no methodName'}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `\`\`\`${error.message || 'no message'} \`\`\``,
            },
          },
          {
            type: 'divider',
          },
          ],
        }],
      };
    },
  }));
}

const colorizer = winston.format.colorize();

const createLabel = ({
  level,
  filename = '',
  methodName = '',
  message = '',
}) => `
${filename && `${colorizer.colorize(level, 'filename')}: ${filename}\n`}${methodName && `${colorizer.colorize(level, 'methodName')}: ${methodName}`}${message && `\n${colorizer.colorize(level, 'message')}: ${message}\n`}`; //eslint-disable-line

const createSpecialLabel = (message) => `${message && `\n${colorizer.colorize('info', message)}`}`; //eslint-disable-line

const warning = (args) => {
  logger.warn(createLabel({ level: 'warn', ...(typeof args === 'string' ? { message: args } : args) }));
};

const error = (args) => logger.error(typeof args === 'string' ? { message: args } : args);

const info = (args) => {
  logger.info(createLabel({ level: 'info', ...(typeof args === 'string' ? { message: args } : args) }));
};

const message = (m) => logger.info(createSpecialLabel(m));

exports.info = info;
exports.error = error;
exports.warning = warning;
exports.message = message;
