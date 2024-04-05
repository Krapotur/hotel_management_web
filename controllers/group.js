const Group = require('../models/Group')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        Group.find().then(
            groups => {
                res.status(200).json(groups)
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const group = await Group.findById({_id: req.params.id})
        await res.status(200).json(group)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        if (await Group.findOne({name: req.body.name})) {
            res.status(409).json({
                message: 'Группа с таким именем уже существует, выберите другое имя'
            })
        } else if (await Group.findOne({title: req.body.title})) {
            res.status(409).json({
                message: 'Группа с таким названием уже существует, выберите другое название'
            })
        } else {
            const group = new Group({
                title: req.body.title,
                name: req.body.name
            })

            await group.save()
            res.status(201).json({
                message: `Группа ${req.body.title} успешно создана`
            })
        }
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        const group = await Group.findOne({_id: req.params.id})
        await Group.deleteOne({_id: req.params.id})
        res.status(200).json({message: `Группа "${group.title}" удалена`})
    } catch (e) {
        errorHandler(res, e)
    }
}

