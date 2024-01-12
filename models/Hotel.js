const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hotelSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    imgSrc: {
        type: String,
        require: true,
    },
    floors: {
        type: Number,
        require: true
    },
    quantityRooms: {
        type: Number,
        require: true,
    },
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
            user: {
                ref: 'users',
                type: Schema.Types.ObjectId
            }
        }],
    },

})

module.exports = mongoose.model('hotels', hotelSchema)