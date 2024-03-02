const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    numberRoom: {
        type: Number,
        require: true,
    },
    floor: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: 'isReady'
    },
    comments: {
        type: [],
    },
    hotel: {
        ref: 'hotels',
        type: Schema.Types.ObjectId
    }


})

module.exports = mongoose.model('rooms', roomSchema)