import socket from 'socket.io'
import { logger } from '../../lib/logger'

export const ioRoute = (socket: socket.Socket, io?: socket.Server) => {
    socket.on('test', data => logger.info(data))
}