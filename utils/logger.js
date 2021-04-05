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

// module.exports.getLogger = (loggerName) => {
//   return log4js.getLogger(loggerName);
// }

const consoleLogger = log4js.getLogger();
const api_use_logger = log4js.getLogger("api_use_log");
const errorLogger = log4js.getLogger("errorLog");

module.exports.setLog = (apiName, result, message) => {
  return {
    apiName,
    result,
    message
  };
}
module.exports.loggerOutput = (level, log) => {
  const { apiName, result, message } = log; 
  switch (level) {
    case "TRACE":
      consoleLogger.trace(`[${apiName}] - [${result}] - ${message}`);
      break;
    case "DEBUG":
      consoleLogger.debug(`[${apiName}] - [${result}] - ${message}`);
      break;
    case "INFO":
      api_use_logger.info(`[${apiName}] - [${result}] - ${message}`);
      break;
    case "WARN":
      api_use_logger.warn(`[${apiName}] - [${result}] - ${message}`);
      break;
    case "ERROR":
      errorLogger.error(`[${apiName}] - [${result}] - ${message}`);
      break;
    case "FATAL":
      errorLogger.fatal(`[${apiName}] - [${result}] - ${message}`);
      break;
    default:
      break;
  }
}