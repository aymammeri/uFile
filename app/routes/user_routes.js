const express = require('express')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const passport = require('passport')
const User = require('../models/user')

const router = express.Router()
const requireToken = passport.authenticate('bearer', { session: false })

router.post('/sign-up', (req, res, next) => {
    const credentials = req.body.credentials
    // create hash with password
    bcrypt.hash(credentials.password, 10)
      .then(hash => {
        // build user object with new hashed password
        const user = {
          email: credentials.email,
          hashedPassword: hash
        }
        // save user to database
        return User.create(user)
      })
    .then(user => res.status(201).json(user))
    .catch(next)
})

router.post('/sign-in', (req, res, next) => {
  // get password from request
  const password = req.body.credentials.password
  // declare user to access in the promise chain
  let user
  // find the user by email
  User.findOne({ email: req.body.credentials.email })
    .then(record => {
      // if no user then throw error
      if (!record) {
        throw new Error('Document not found')
      }
      // if we find a record save to our user variable
      user = record
      // compare password and stored password
      return bcrypt.compare(password, user.hashedPassword)
    })
    .then(correctPassword => {
      // if password is a match
      if (correctPassword) {
        // create a token
        const token = crypto.randomBytes(16).toString('hex')
        // add token to user
        user.token = token
        // save user
        return user.save()
      // else then throw error
      } else {
        throw new Error('Email or password is invalid')
      }
    })
    // respond with user and the token
    .then(user => {
      res.status(201).json({ user })
    })
    .catch(next)
})

router.patch('/change-password', requireToken, (req, res, next) => {
  // declare user to access in the promise chain
  let user
  // find user by their id
  User.findById(req.user.id)
    // if we find a record save to our user variable
    .then(record => {
      user = record
      // compare old password and stored password
      return bcrypt.compare(req.body.passwords.old, user.hashedPassword)
    })
    .then(correctPassword => {
      // if the password is incorrect or there is no new password
      if (!correctPassword || !req.body.passwords.new) {
        throw new Error('A required parameter was omitted or invalid')
      }
      // if password is correct then encrypt new password
      return bcrypt.hash(req.body.passwords.new, 10)
    })
    .then(hash => {
      // add new has as hashed password for user
      user.hashedPassword = hash
      // save user
      return user.save()
    })
    // respond with 204
    .then((user) => res.status(200).json({ user }))
    .catch(next)
})

router.delete('/sign-out', requireToken, (req, res, next) => {
  //create new token
  req.user.token = crypto.randomBytes(16)
  req.user.save()
    // do not send new token back to client
    .then(() => res.sendStatus(200))
    .catch(next)
})

module.exports = router