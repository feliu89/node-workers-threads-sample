import {createLogger, format, transports } from "winston";
const { combine, printf, label, timestamp, colorize, simple } = format;

const customLogFormat = () =>{
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });
    return combine(label({ label: 'main-logger' }), timestamp(), myFormat)
}

const logger = createLogger({
    level: 'info',
    format: customLogFormat(),
    transports: [
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' }),
    ],
  });

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({format}));
}

export default logger;
