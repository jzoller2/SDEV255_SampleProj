const { get } = require('../controllers/enroll')
const dashboardRouter = require('express').Router()

dashboardRouter.get('/enroll', get)

module.exports = dashboardRouter