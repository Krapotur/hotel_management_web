const express = require('express')
const passport = require('passport')
const upload = require('../middleware/upload')
const router = express.Router()
const controller = require('../controllers/house')

router.get('/', controller.getAll)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update)


module.exports = router