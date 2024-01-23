const Hotel = require('../models/Hotel')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        Hotel.find().then(
            hotels => {
                res.status(200).json(hotels)
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const hotel = await Hotel.findById({_id: req.params.id})
        res.status(200).json(hotel)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        const hotel = await Hotel.findOne({_id: req.params.id})
        await Hotel.deleteOne({_id: req.params.id})
        res.status(200).json({message: `Гостиница "${hotel.title}" удалена`})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    if (await Hotel.findOne({title: req.body.title})) {
        res.status(409).json({
            message: `Гостиница ${req.body.title} уже есть`
        })
    } else {
        // let rooms = []
        //
        // for (let i = 0; i < req.body.rooms.length; i++) {
        //     rooms.push(req.body.rooms[i])
        // }

        const hotel = new Hotel({
            title: req.body.title,
            imgSrc: req.file ? req.file.path : '',
            floors: req.body.floors,
            quantityRooms: req.body.quantityRooms,
            rooms: rooms
        })

        try {
            await hotel.save()
            res.status(201).json({
                message: `Гостиница ${hotel.title} успешно добавлена`
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        title: req.body.title
    }

    if (req.file) {
        updated.imageSrc = req.file.path
    }

    try {
        const hotel = await Hotel.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(hotel)
    } catch (e) {
        errorHandler(res, e)
    }
}