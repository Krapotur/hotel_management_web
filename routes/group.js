const express = require('express')
const router = express.Router()
const controller = require('../controllers/group')

router.get('/groups', controller.getAll)


module.exports = router