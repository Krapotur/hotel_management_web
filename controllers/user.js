const multiparty = require('multiparty')
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

    let form = new multiparty.Form();

    await form.parse(req, async function (err, fields) {
        let candidate = {}

        candidate.firstName = fields['firstName'][0];
        candidate.lastName = fields['lastName'][0];
        candidate.phone = fields['phone'][0];
        candidate.hotels = fields['hotels'];
        candidate.login = fields['login'][0];
        candidate.password = fields['password'][0];


        if (await User.findOne({login: candidate.login})) {

            res.status(409).json({
                message: `Логин ${candidate.login} уже занят`
            })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const password = candidate.password

            const user = new User({
                lastName: candidate.lastName,
                firstName: candidate.firstName,
                phone: candidate.phone,
                hotels: candidate.hotels,
                login: candidate.login,
                password: bcrypt.hashSync(password, salt)
            })
            console.log(user)
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
    })

}

module.exports.update = function (req, res) {

}