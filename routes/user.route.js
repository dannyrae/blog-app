const router = require('express').Router()
const User = require('../models/user.model')
const { createUser, loginUser} = require('../controllers/user.controller')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// require('dotenv').config()

router.post('/signup', createUser)

router.post('/login', loginUser)

module.exports = router