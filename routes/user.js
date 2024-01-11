const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')

router.get('/', controller.getAll)
router.get('/users/:id', controller.getById)
router.delete('/user/:id', controller.delete)
router.post('/', controller.create)
router.patch('/users/:id', controller.update)


module.exports = router