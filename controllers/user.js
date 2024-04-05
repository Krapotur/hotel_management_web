const User = require('../models/User')
const Hotel = require('../models/Hotel')
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
            lastName: req.body.lastName ? req.body.lastName: '',
            firstName: req.body.firstName ? req.body.firstName: '',
            phone: req.body.phone ? req.body.phone : '',
            post: req.body.post,
            hotels: [],
            login: req.body.login,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json({
                message: `Пользователь ${user.lastName + ' ' + user.firstName} успешно создан`
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.update = async function (req, res) {

    const candidate = await User.findOne({_id: req.params.id})
    let updated = {}

    if (req.body.status || !req.body.status) updated.status = req.body.status
    if (req.body.lastName) updated.lastName = req.body.lastName
    if (req.body.firstName) updated.firstName = req.body.firstName
    if (req.body.phone) updated.phone = req.body.phone
    if (req.body.post) updated.post = req.body.post
    if (req.body.login) updated.login = req.body.login.toLowerCase()

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
                message: `Пароль успешно изменен`
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
                message: `Изменения внесены`
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}