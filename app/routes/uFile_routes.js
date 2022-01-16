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
    fieldName: req.file.fieldname,
    encoding: req.file.encoding,
    mimetype: req.file.mimetype,
    destination: req.file.destination,
    fileName: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    owner: req.user._id
  })
    .then(() => res.status(201).send('File uploaded successfully! '))
    .catch(next)
})

router.get('/files/:id', requireToken, (req, res, next) => {
  File.findOne({ _id: req.params.id, owner: req.user.id })
    .then(file => res.status(201).json(file))
    .catch(next)
})

router.get('/files', requireToken, (req, res, next) => {
  File.find({ owner: req.user.id })
    .then(file => res.status(201).json(file))
    .catch(next)
})

router.patch('/files/:id', requireToken, (req, res, next) => {

  File.updateOne({ _id: req.params.id, owner: req.user.id }, {
    name: req.body.name
  })
    .then(file => res.status(200).json(file))
})

router.delete('/files/:id', requireToken, (req, res, next) => {
  File.deleteOne({ _id: req.body.fileID, owner: req.user._id })
    .then(file => {
      // fs.unlink(file.path)
      res.status(201).json(file)
    })
    .catch(next)
})

module.exports = router
