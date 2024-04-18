const { get, post, put, del } = require('../controllers/courses')
const coursesRouter = require('express').Router()

coursesRouter.get('/:courseId?', get)
coursesRouter.post('/', post)
coursesRouter.put('/', put)
coursesRouter.delete('/courses', del)
coursesRouter.post('/user')

module.exports = coursesRouter
