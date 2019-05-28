import { createLogger, format, transports } from 'winston'
const { combine } = format

const logger = createLogger({
    level: 'info',
    format: combine(
        format.colorize(),
        format.timestamp(),
        format.simple()
    ),
    transports: [
        new transports.File({ filename: __dirname + '/logs/error.log', level: 'error' }),
        new transports.File({ filename: __dirname + '/logs/combined.log' })
    ]
})

if (process.env.LOG_LEVEL === 'dev') {
    logger.add(new transports.Console({
        level: 'info',
        format: combine(
            format.colorize(),
            format.timestamp(),
            format.simple()
        )
    })
    )
    logger.info('Log Level: dev')
}

if (process.env.LOG_LEVEL === 'debug') {
    logger.add(new transports.Console({
        level: 'debug',
        format: combine(
            format.colorize(),
            format.timestamp(),
            format.simple()
        )
    })
    )
    logger.info('Log Level: debug')
}

export { logger }