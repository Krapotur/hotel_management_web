const House = require('../models/House')
const errorHandler = require('../utils/errorHandler')

const key = require("../config/service-account.json");
const Room = require("../models/Room");

const {google} = require('googleapis')
const MESSAGE_SCOPE = "https://www.googleapis.com/auth/firebase.messaging"
const SCOPES = [MESSAGE_SCOPE]

const https = require('https')
const {data} = require("express-session/session/cookie");

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var key = require("../config/service-account.json")
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        )
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err)
                return
            }
            resolve(tokens.access_token)
        })
    })
}

module.exports.getAll = async function (req, res) {
    try {
        House.find().then(
            houses => {
                let housesList = []
                if (req.query.search) {
                    housesList = houses.filter(
                        house => house.title.toLowerCase().includes(req.query.search))
                    res.status(200).json(housesList)
                } else {
                    res.status(200).json(houses)
                }
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
    let updated = {}

    if (req.body.title) updated.title = req.body.title
    if (req.body.status) updated.status = req.body.status
    if (req.body.tasks) updated.tasks = req.body.tasks

    if (req.body.statusReady) updated.statusReady = req.body.statusReady
    if (req.body.statusReady === 'isReady') {
        updated.comments = ''
        updated.tasks = ''
    }

    if (req.body.comments) {
        if (req.body.comments.length > 4) {
            updated.comments = req.body.comments
        }
    }

    if (req.file) updated.imgSrc = req.file.path
    if (req.body.personal) updated.personal = req.body.personal

    try {
        await House.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )

        if (req.body.statusReady !== 'isReady' && req.body.tasks) {
            await sendAlert(req.body.title, req.body.tasks)
        }

        res.status(200).json({
            message: 'Изменения внесены'
        })

    } catch (e) {
        errorHandler(res, e)
    }
}

async function sendAlert(house, tasks) {
    const token = await getAccessToken()

    const data = JSON.stringify({
        message: {
            topic: "hotels",
            notification: {
                title: `Дом ${house}`,
                body: `Задание:  ${tasks}`,
                image: `https://etnomirglobal.com/upload/iblock/e0c/1.jpg`
            },
            data: {
                id: `Nothing`
            }
        }
    })

    const options = {
        hostname: 'fcm.googleapis.com',
        path: '/v1/projects/hotel-management-8cd58/messages:send',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type':
                'application/json; charset=UTF-8',
        }
    }
    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })
    req.on('error', (error) => {
        console.error(error)
    })
    req.write(data)
    req.end()
}

