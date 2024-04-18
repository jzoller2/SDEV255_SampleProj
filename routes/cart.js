const router = require('express').Router()
const { get, post } = require('../controllers/cart')

router.get('/', get)
router.post('/', post)

module.exports = router
