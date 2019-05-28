import express from 'express'

const leaderboard = express.Router()

leaderboard.get('/', (_, res) => res.send('Sample'))
leaderboard.post('/', (_, res) => res.send('Sample'))

export { leaderboard }
