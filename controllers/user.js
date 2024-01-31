const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const bcrypt = require('bcryptjs')

module.exports.getAll = async function (req, res) {
    try {
        User.find().then(
            users => {
                res.status(200).json(users)
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const user = await User.findById({_id: req.params.id})
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        const user = await User.findOne({_id: req.params.id})
        await User.deleteOne({_id: req.params.id})
        res.status(200).json({message: `Пользователь "${user.lastName + ' ' + user.firstName}" удален`})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {

    if (await User.findOne({login: req.body.login})) {

        res.status(409).json({
            message: `Логин ${req.body.login} уже занят`
        })
    } else {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password

        const user = new User({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            phone: req.body.phone,
            post: req.body.post,
            hotels: [],
            login: req.body.login,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json({
                message: 'Успех'
                // message: `Пользователь ${user.lastName + ' ' + user.firstName} успешно создан`
            })
        } catch (e) {
            errorHandler(res, e)
        }


    }

}

module.exports.update = async function (req, res) {

    console.log(req.body.hotel)
    const candidate = await User.findOne({_id: req.params.id})
    const updated = {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        phone: req.body.phone,
        post: req.body.post,
        login: req.body.login,
    }

    if (req.body.hotel) {
        let arr = candidate.hotels
        if (!arr.includes(req.body.hotel)) {
            arr.push(req.body.hotel)
        } else {
            let idxHotel = arr.indexOf(req.body.hotel)
            arr.splice(idxHotel)
        }
        updated.hotels = arr
    }

    if (req.body.password) {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password

        updated.password = bcrypt.hashSync(password, salt)

        try {
            await User.findByIdAndUpdate(
                {_id: req.params.id},
                {$set: updated},
                {new: true}
            )
            res.status(200).json({
                message: `Изменения внесены" `
            })
        } catch (e) {
            errorHandler(res, e)
        }
    } else {
        try {
            await User.findByIdAndUpdate(
                {_id: req.params.id},
                {$set: updated},
                {new: true}
            )
            res.status(200).json({
                message: `Изменения внесены" `
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}