const express = require('express')
const passport = require('passport')
const upload = require('../middleware/upload')
const router = express.Router()
const controller = require('../controllers/hotel')

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.get('/hotels/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.delete('/hotels/:id', passport.authenticate('jwt', {session: false}), controller.delete)
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create)
router.patch('/hotels/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update)


module.exports = router