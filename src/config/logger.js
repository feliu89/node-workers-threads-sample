import winston from 'winston';

const myFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    label ? label : (label = 'app');
    return `${timestamp} [${label}] ${level}: ${message}`;
  },
);

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    verbose: 'cyan',
    debug: 'grey',
    silly: 'magenta',
  },
};

winston.addColors(config.colors);

const logger = winston.createLogger({
  levels: config.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    myFormat,
  ),
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: './logs/error.log',
    }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './logs/exceptions.log' }),
  ],
  level: 'silly',
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.json(),
        myFormat,
      ),
    }),
  );
}

export default logger;
