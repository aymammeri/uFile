const mongoose = require('mongoose')
const userSchema = require('./user')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    scheduled: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamp : true,
})

module.exports = mongoose.model('Event', eventSchema)