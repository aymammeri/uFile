const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./app/routes/user_routes')
const auth = require('./lib/auth')

mongoose.connect('mongodb://127.0.0.1/whole-commerce', {useUnifiedTopology: true, useNewUrlParser: true })

const requestLogger = require('./lib/request_logger')
const errorHandler = require('./lib/error_handler')

const app = express()

// register middleware
app.use(cors())
app.use(auth)
app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use(requestLogger)
app.use(userRoutes)
app.use(errorHandler)

app.listen(4741, () => console.log("server is running"))
