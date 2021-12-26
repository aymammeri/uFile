const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    token: String
}, {
    timestamp : true,
    toJSON: {
        virtuals: true,
        // `user` is the returned Mongoose document
        // named `user` because it will be a `User` object
        transform: (_doc, user) => {
          delete user.hashedPassword
          return user
        }
    }
})

module.exports = mongoose.model('User', userSchema)