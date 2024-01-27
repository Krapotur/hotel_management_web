const Room = require('../models/Room')
const errorHandler = require('../utils/errorHandler')


module.exports.getAll = async function (req, res) {
    try {
        Room.find().then(
            posts => {
                res.status(200).json(rooms)
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const room = await Room.findById({_id: req.params.id})
        await res.status(200).json(room)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        if (await Room.findOne({title: req.body.title})) {
            res.status(409).json({
                message: `"${req.body.title}" уже существует`
            })
        } else {
            const room = new Room({
                title: req.body.title
            })

            await room.save()
            res.status(201).json({
                message: `Должность "${req.body.title}" успешно создан`
            })
        }
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    console.log(req.params.id)
    try {
        const room = await Room.findById({_id: req.params.id})
        await Room.deleteOne({_id: room._id})
        res.status(200).json({message: `Должность "${room.title}" удалена`})
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.update = async function (req, res) {

    const updated = {
        title: req.body.title
    }

    try {
        const room = await Room.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(room)
    } catch (e) {
        errorHandler(res, e)
    }
}

