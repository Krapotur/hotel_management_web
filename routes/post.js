const express = require('express')
const router = express.Router()
const controller = require('../controllers/post')

router.get('/', controller.getAll)
router.get('/posts/:id', controller.getById)
router.delete('/posts/:id', controller.delete)
router.post('/', controller.create)

module.exports = router