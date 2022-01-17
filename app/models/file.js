const mongoose = require('mongoose')

// eslint-disable-next-line no-unused-vars
const User = require('./user')

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  encoding: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
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
