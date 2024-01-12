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
    login: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        require: true,
    },
    group: {
        ref: 'groups',
        type: Schema.Types.ObjectId,
    }
})

module.exports = mongoose.model('users', userSchema)