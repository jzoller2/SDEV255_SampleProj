const { get, post } = require('../controllers/login'),
      loginRouter = require('express').Router()

loginRouter.get('/', get)
loginRouter.post('/', post)

module.exports = loginRouter