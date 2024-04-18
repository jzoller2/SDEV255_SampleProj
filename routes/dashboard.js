const { get, enroll, dropCourse, logout } = require('../controllers/dashboard')
const dashboardRouter = require('express').Router()

dashboardRouter.get('/', get)
dashboardRouter.get('/enroll', enroll); 
dashboardRouter.get('/dropCourse', dropCourse); 
dashboardRouter.get('/logout', logout);

module.exports = dashboardRouter
