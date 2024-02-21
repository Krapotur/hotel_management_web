const House = require('../models/House')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        House.find().then(
            houses => {
                res.status(200).json(houses)
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const house = await House.findById({_id: req.params.id})
        res.status(200).json(house)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        const house = await House.findOne({_id: req.params.id})
        await House.deleteOne({_id: req.params.id})
        res.status(200).json({message: `Дом "${house.title}" удален`})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    console.log(req.body.personal)

    if (await House.findOne({title: req.body.title})) {
        res.status(409).json({
            message: `Дом ${req.body.title} уже есть`
        })
    } else {
        let house = new House({
            title: req.body.title,
            imgSrc: req.file ? req.file.path : '',
            floors: Number(req.body.floors),
            personal: req.body.personal
        })

        try {
            await house.save()
            res.status(201).json({
                message: `Дом ${req.body.title} успешно добавлен`
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.update = async function (req, res) {

    const house = await House.findOne({title: req.body.title})
    if(house && !req.file && !req.body.title){
        res.status(409).json({
            message: `Дом ${req.body.title} уже есть`
        })
    } else {
        const updated = {
            title: req.body.title,
            personal: req.body.personal
        }

        if (!req.body.personal){
            updated.personal = []
        }

        if (req.file) {
            updated.imageSrc = req.file.path
        }

        try {
            await House.findByIdAndUpdate(
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

}
