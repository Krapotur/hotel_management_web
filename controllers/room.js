const Room = require('../models/Room')
const Hotel = require('../models/Hotel')
const errorHandler = require('../utils/errorHandler')

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
        await Room.find().then(rooms => res.status(200).json(rooms))
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
    if (req.body.roomsStr) {
        let hotel = await Hotel.findOne({title: req.body.hotelTitle})

        let rooms = []
        for (let i = 0; i < req.body.roomsStr.length; i++) {
            let arr = req.body.roomsStr[i].split('-')
            for (let j = arr[1]; j <= arr[2]; j++) {
                let room = {
                    numberRoom: Number(j),
                    floor: arr[0],
                    status: 'isReady',
                    tasks: '',
                    hotel: hotel._id
                }
                rooms.push(room)
            }
        }

        try {
            await Room.collection.insertMany(rooms)
            res.status(201).json({
                message: `Гостиница "${hotel.title}" успешно добавлена`
            })

        } catch (e) {
            errorHandler(res, e)
        }
    } else if (await Room.findOne({
        numberRoom: req.body.numberRoom,
        hotel: req.body.hotel
    })) {
        res.status(409).json({
            message: `Номер ${req.body.numberRoom} уже существует`
        })
    } else {
        const room = new Room({
            numberRoom: req.body.numberRoom,
            floor: req.body.floor,
            hotel: req.body.hotel
        })

        try {
            await room.save()
            res.status(201).json({
                message: `Номер ${req.body.numberRoom} успешно добавлен`
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.delete = async function (req, res) {
    let room = await Room.findOne({_id: req.params.id})
    let hotel = await Hotel.findOne({_id: room.hotel})
    if (!hotel) {
        try {
            await Room.deleteMany({hotel: room.hotel})
            res.status(200).json({message: `Гостиница удалена`})
        } catch (e) {
            errorHandler(res, e)
        }
    } else {
        try {
            const room = await Room.findById({_id: req.params.id})
            await Room.deleteOne({_id: room._id})
            res.status(200).json({message: `Номер ${room.numberRoom} удален`})
        } catch (e) {
            errorHandler(res, e)
        }
    }
}


module.exports.update = async function (req, res) {
    const hotel = await Hotel.findOne({_id: req.body.hotel})

    const updated = {
        status: req.body.status,
        tasks: req.body.tasks,
        comments: req.body.comments
    }

    if (req.body.status === 'isReady') {
        updated.comments = ''
        updated.tasks = ''
    }

    try {
        await Room.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )

        res.status(200).json({message: 'Изменения внесены'})

        if (req.body.status !== 'isReady') {
            await sendAlert(hotel, req.body.numberRoom)
        }

    } catch (e) {
        errorHandler(res, e)
    }
}

async function sendAlert(hotel, numberRoom) {
    const token = await getAccessToken()

    const data = JSON.stringify({
        message: {
            topic: "hotels",
            notification: {
                title: `Гостиница ${hotel.title}`,
                body: `Номер ${numberRoom}`,
                image: `https://etnomirglobal.com/upload/iblock/e0c/1.jpg`
            },
            data:{
                id: `${hotel._id}`
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
