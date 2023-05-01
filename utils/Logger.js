const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const { combine, timestamp, printf, colorize } = winston.format;
const logDir = 'logs';

const format = combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    printf(info => {
        return `${info.timestamp} [${info.level}] ${info.message}`;
    }),
);

const transports = [
    new winston.transports.Console({ 
        format: winston.format.combine(
          winston.format.splat(), 
          winston.format.colorize(),)
      }),
      new winstonDaily({
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true, 
        filename: `%DATE%.log`,
        dirname: logDir,
        maxFiles: 30,
      }),
      new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        filename: `%DATE%.error.log`,
        dirname: logDir + '/error',
        maxFiles: 30,
      }),
];

const logger = winston.createLogger({
    format: format,
    transports: transports
});

module.exports = logger