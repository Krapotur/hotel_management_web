const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },

    phone: {
        type: String
    },
    hotels: {
        type: [] ,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    login: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = mongoose.model('users', userSchema)