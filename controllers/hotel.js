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
    console.log(req.body.personal)

    if (await Hotel.findOne({title: req.body.title})) {
        res.status(409).json({
            message: `Гостиница ${req.body.title} уже есть`
        })
    } else {
        let hotel = new Hotel({
            title: req.body.title,
            imgSrc: req.file ? req.file.path : '',
            floors: Number(req.body.floors),
            personal: req.body.personal
        })

        try {
            await hotel.save()
            res.status(201).json(hotel)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.update = async function (req, res) {
    let updated = {}

    if (req.body.status) updated.status = req.body.status
    if (req.body.title) updated.title = req.body.title
    if (req.body.personal) updated.personal = req.body.personal
    if (req.file) updated.imgSrc = req.file.path

    try {
        await Hotel.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json({
            message: 'Изменения внесены'
        })
    } catch (e) {
        errorHandler(res, e)
    }

}
