const router = require('express').Router()
const { post } = require('../controllers/userCourses')

router.post('/', post)

module.exports = router