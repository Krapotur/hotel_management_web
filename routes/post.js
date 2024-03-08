const express = require('express')
const router = express.Router()
const controller = require('../controllers/post')
const passport = require("passport");

router.get('/',passport.authenticate('jwt', {session: false}),  controller.getAll)
router.get('/posts/:id',passport.authenticate('jwt', {session: false}),  controller.getById)
router.delete('/:id',passport.authenticate('jwt', {session: false}),  controller.delete)
router.patch('/:id',passport.authenticate('jwt', {session: false}),  controller.update)
router.post('/',passport.authenticate('jwt', {session: false}),  controller.create)

module.exports = router