import express from 'express'

const fight = express.Router()

fight.post('/', (_, res) => res.send('Sample'))

export { fight }
