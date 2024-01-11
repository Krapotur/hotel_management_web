const express = require('express')
const app = express()
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/group')
const hotelRoutes = require('./routes/hotel')

app.use('/api/auth', authRoutes)
app.use('/api', groupRoutes)
app.use('/api', hotelRoutes)

module.exports = app