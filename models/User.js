const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    status:{
      type: Boolean,
      default: true
    },
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
    post: {
        type: String
    },
    hotels: {
        type: []
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