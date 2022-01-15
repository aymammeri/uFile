const express = require('express')
const passport = require('passport')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})

const File = require('../models/file')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.post('/upload', requireToken, upload.single('file'), (req, res, next) => {
  console.log(req.file)
  File.create({
    name: req.file.originalname,
    srcFile: req.file.path,
    owner: req.user._id
  })
    .then(() => res.status(201).send('File uploaded successfully! '))
    .catch(next)
})

router.get('/files/:id', requireToken, (req, res, next) => {
  File.findOne({ owner: req.user.id, _id: req.params.id })
    .then(file => res.status(201).json(file))
    .catch(next)
})

router.get('/files', requireToken, (req, res, next) => {
  File.find({ owner: req.user.id })
    .then(file => res.status(201).json(file))
    .catch(next)
})

router.patch('/files/:id', requireToken, (req, res, next) => {
  File.findOne({ owner: req.user.id, _id: req.params.id })
    .then()
})

router.delete('/files/delete', requireToken, (req, res, next) => {
  File.findOne({ _id: req.body.fileID, owner: req.user._id })
  // .then(file => console.log(file.srcFile))
  // .then(file => fs.unlink(file.srcFile))
  File.deleteOne({ _id: req.body.fileID, owner: req.user._id })
    .then(file => res.status(201).json(file))
    .catch(next)
})

module.exports = router
