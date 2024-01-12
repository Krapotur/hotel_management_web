const express = require('express')
const passport = require('passport')
const router = express.Router()
const controller = require('../controllers/hotel')

router.get('/',passport.authenticate('jwt', {session: false}), controller.getAll)
router.get('/hotels/:id', controller.getById)
router.delete('/hotels/:id', controller.delete)
router.post('/', controller.create)
router.patch('/hotels/:id', controller.update)


module.exports = router