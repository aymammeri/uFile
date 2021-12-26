const passport = require('passport')
const bearer = require('passport-http-bearer')
const User = require('../app/models/user')

passport.use(new bearer.Strategy( function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      return done(null, user, { scope: 'all' })
    })
  }
))

module.exports = passport.initialize()