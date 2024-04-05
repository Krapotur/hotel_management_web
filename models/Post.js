const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema ({
    title: {
        type: String,
        require: true,
        unique: true
    },
})

module.exports = mongoose.model('posts', postSchema)