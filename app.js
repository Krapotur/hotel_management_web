const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/group')
const hotelRoutes = require('./routes/hotel')
const houseRoutes = require('./routes/house')
const roomRoutes = require('./routes/room')
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI)
    .then(() => console.log('Database is connected !!!'))
    .catch(error => console.log('Error : ' + error))


app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())


app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/houses',houseRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/dist/browser'))

    app.get('*', (req,res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'browser', 'index.html'
            )
        )
    })
}
// else {
//     app.use(express.static('client/dist/404'))
//
//     app.get('*', (req,res) => {
//         res.sendFile(
//             path.resolve(
//                 __dirname, 'client', 'dist', '404', 'index.html'
//             )
//         )
//     })
// }

module.exports = app