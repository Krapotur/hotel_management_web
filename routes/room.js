const express = require('express')
const router = express.Router()
const controller = require('../controllers/room')
const passport = require("passport");

router.get('/',  controller.getAll)
router.get('/rooms/:id', controller.getById)
router.delete('/:id', controller.delete)
router.patch('/:id', controller.update)
router.post('/', controller.create)

module.exports = router