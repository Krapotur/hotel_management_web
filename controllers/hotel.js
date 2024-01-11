const Hotel = require('../models/Hotel')

module.exports.getAll = function (req, res) {

}

module.exports.getById = function (req, res) {

}

module.exports.delete = function (req, res) {

}

module.exports.create = function (req, res) {
    const hotel = new Hotel({
        title: req.body.title,
        imgSrc: req.body.imgSrc,
        floors: req.body.floors,
        quantityRooms: req.body.quantityRooms,
        rooms: [{
            numberRoom: req.body.rooms[0].numberRoom,
            status: req.body.rooms[0].status,
            floor: req.body.rooms[0].floor,
            comment: req.body.rooms[0].comment,
        }, {
            numberRoom: req.body.rooms[1].numberRoom,
            status: req.body.rooms[1].status,
            floor: req.body.rooms[1].floor,
            comment: req.body.rooms[1].comment,
        }, {
            numberRoom: req.body.rooms[2].numberRoom,
            status: req.body.rooms[2].status,
            floor: req.body.rooms[2].floor,
            comment: req.body.rooms[2].comment,
        }, {
            numberRoom: req.body.rooms[3].numberRoom,
            status: req.body.rooms[3].status,
            floor: req.body.rooms[3].floor,
            comment: req.body.rooms[3].comment,
        },
        ]
    })

    hotel.save().then(() => console.log(hotel))
}

module.exports.update = function (req, res) {

}