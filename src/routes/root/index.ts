import express from 'express'

const root = express.Router() 

root.get('/', (_, res) => res.send('api root'))

export { root }
