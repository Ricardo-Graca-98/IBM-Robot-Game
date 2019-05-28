import express from 'express'

const stats = express.Router() 

stats.get('/', (_, res) => res.send('api root'))

export { stats }
