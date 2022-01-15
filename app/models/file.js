const mongoose = require('mongoose')

// eslint-disable-next-line no-unused-vars
const User = require('./user')

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  srcFile: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('File', fileSchema)
