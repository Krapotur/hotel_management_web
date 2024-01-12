const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({login: req.body.login})

    try {
        if (candidate) {
            const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
            if (passwordResult) {
                const token = jwt.sign({
                    login: candidate.login,
                    userId: candidate._id
                }, keys.jwt, {expiresIn: 60 * 60})

                const userToken = {
                    token: `Bearer ${token}`,
                    group: candidate.group,
                    user: candidate.lastName + ' ' + candidate.firstName
                }
                console.log(userToken.group)
                res.status(200).json(userToken)

            } else {
                res.status(401).json({
                    message: 'Неверный пароль. Попробуйте еще раз'
                })
            }
        } else {
            res.status(404).json({
                message: 'Такого пользователя не существует, используйте существующий аккаунт'
            })
        }
    } catch (e) {
        errorHandler(res, e)
    }
}
