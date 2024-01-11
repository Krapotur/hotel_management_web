const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema ({
    title: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true,
        unique:true
    }
})

module.exports = mongoose.model('groups', groupSchema)