const User = require('../models/User')

module.exports.login = function (req, res) {
    res.status(200).json({
        login: req.body
    })
}

module.exports.register = function (req, res) {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        login: req.body.login,
        password: req.body.password,
    })
    user.save().then(() => console.log(user))
    res.status(200).json({

    })
}