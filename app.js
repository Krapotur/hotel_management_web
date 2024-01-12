const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/group')
const hotelRoutes = require('./routes/hotel')
const userRoutes = require('./routes/user')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI)
    .then(() => console.log('Database is connected !!!'))
    .catch(error => console.log('Error : ' + error))


app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())


app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/users', userRoutes)


module.exports = app