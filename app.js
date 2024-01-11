const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI)
    .then(() => console.log('Database is connected !!!'))
    .catch(error => console.log('Error : '+ error))

const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/group')
const hotelRoutes = require('./routes/hotel')
const userRoutes = require('./routes/user')

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/users', userRoutes)


module.exports = app