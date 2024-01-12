const express = require('express')
const router = express.Router()
const controller = require('../controllers/group')

router.get('/', controller.getAll)
router.get('/groups/:id', controller.getById)
router.delete('/groups/:id', controller.delete)
router.post('/', controller.create)

module.exports = router