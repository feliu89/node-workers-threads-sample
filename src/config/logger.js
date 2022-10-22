import winston from "winston";

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.label({ label: 'app' }),
      winston.format.timestamp(),
      winston.format.simple(),
      myFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.label({ label: 'app' }),
        winston.format.timestamp(),
        winston.format.json(),
        myFormat
      )
    }));
  }

export default logger;
