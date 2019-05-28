import express from 'express'
import passport from 'passport'

const user = express.Router() 

user.get('/login', passport.authenticate('twitter'))

user.get('/oauth',
  passport.authenticate('twitter', { failureRedirect: '/user/login' }),
  (_, res) => res.redirect('/')
);

export { user }
