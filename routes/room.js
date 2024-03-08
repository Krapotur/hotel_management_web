const express = require('express')
const router = express.Router()
const controller = require('../controllers/room')
const passport = require("passport");

router.get('/',passport.authenticate('jwt', {session: false}),  controller.getAll)
router.get('/rooms/:id',passport.authenticate('jwt', {session: false}),  controller.getById)
router.delete('/:id',passport.authenticate('jwt', {session: false}),  controller.delete)
router.patch('/:id',passport.authenticate('jwt', {session: false}),  controller.update)
router.post('/',passport.authenticate('jwt', {session: false}),  controller.create)

module.exports = router