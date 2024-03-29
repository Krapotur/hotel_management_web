const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hotelSchema = new Schema({
    status:{
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        require: true,
        unique: true
    },
    imgSrc: {
        type: String,
        default: ''
    },
    floors: {
        type: Number,
        require: true
    },
    roomsStr:[],
    rooms: {
        type: [{
            numberRoom: {
                type: Number,
                require: true,
            },
            status: {
                type: String,
                require: true,
            },
            floor: {
                type: Number,
                require: true,
            },
            comment: {
                type: String,
                default: '',
            },
        }],
        default: []
    },
    quantityRooms: {
        type: Number
    },
    personal: {
        type:[{
            type: String
        }]
    }
})

module.exports = mongoose.model('hotels', hotelSchema)