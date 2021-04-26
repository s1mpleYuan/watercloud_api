const log4js = require('log4js');

log4js.configure({
  appenders: {
    console:
    {
      type: 'console',
    },
    errorLog: {
      type: "file",
      filename: "errorLog.log"
    },
    api_use_log: {
      type: "file",
      filename: "api_use_log.log"
    }
  },
  categories: {
    default:
    {
      appenders: ['console'],
      level: "trace",
    },
    errorLog: {
      appenders: ["errorLog", "console"],
      level: "error"
    },
    api_use_log: {
      appenders: ["api_use_log", "console"],
      level: "info"
    }
  }
});


const consoleLogger = log4js.getLogger();
const api_use_logger = log4js.getLogger("api_use_log");
const errorLogger = log4js.getLogger("errorLog");

module.exports.logger = (api, level, msg) => {
  switch (level) {
    case 'CONSOLE':
      consoleLogger.trace(`api path: ${api} - is used`);
      break;
    case 'API USE':
      // consoleLogger.trace(`api path: ${api} - is used`);
      api_use_logger.info(`api path: ${api} - is used`);
      break;
    case 'ERROR':
      // consoleLogger.error(`api path: ${api} - is errored - ${msg}`);
      errorLogger.error(`api path:${api} - error: ${msg}`)
      break;
    default:
      break;
  }
};