import express from 'express'
import http from 'http' 
import path from 'path'
import socket from 'socket.io'
import bodyParser from 'body-parser'
import passport from 'passport'
import expressSession from 'express-session'

import { Strategy } from 'passport-twitter'

import { logger } from './lib/logger'
import { root, user, leaderboard, fight } from './routes'
import { ioRoute } from './routes'

const port = process.env.PORT || 3000

const app = express()
const server = new http.Server(app)
const io = socket(server)

passport.use(new Strategy({
        consumerKey: 'TWITTER_CONSUMER_KEY',
        consumerSecret: 'TWITTER_CONSUMER_SECRET',
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
    },
    (token, tokenSecret, profile, cb) => cb(null, profile)
))

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession(
    { 
        secret: 'keyboard cat', 
        resave: true, 
        saveUninitialized: true 
    }
))

console.log(path.join(__dirname, 'public'))

app.use('/', express.static(path.join('./public')))

app.use('/api', root)
app.use('/api/user', user)
app.use('/api/leaderboard', leaderboard)
app.use('/api/fight', fight)

io.on('connection', (socket) => {
    logger.info(`Client ${socket.client} connected`)
    ioRoute(socket, io)
})

server.listen(port, () => {
    // tslint:disable-next-line:no-console
    logger.info(`Server started at http://localhost:${ port }` );
})