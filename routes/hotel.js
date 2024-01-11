const express = require('express')
const router = express.Router()
const controller = require('../controllers/hotel')

router.get('/hotels', controller.getAll)


module.exports = router