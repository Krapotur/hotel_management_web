const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')
const passport = require("passport");

router.get('/',passport.authenticate('jwt', {session: false}),  controller.getAll)
router.get('/:id',passport.authenticate('jwt', {session: false}),  controller.getById)
router.delete('/:id',passport.authenticate('jwt', {session: false}),  controller.delete)
router.post('/', controller.create)
router.patch('/:id',controller.update)


module.exports = router