const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const createUser = async (req, res, next) => {
  try {
    // grab details from the request
    const { firstname, lastname, username, email, password } = req.body

    const user = await User.findOne({ username })
    if (user) return res.status(400).json({ status: false, message: "User already exists!" })

    // create user object
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password,
    })
    // save to database
    const createdUser = await newUser.save()
    // return response
    return res.status(201).json({
      status: true,
      data: createdUser,
    })
  } catch (e) {
    next(e)
  }
}


const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(400).json({ status: false, message: "Invalid Credentials!" })
    console.log(user)

    // const validate =  bcrypt.compare(req.body.password, user.password)
    const passwordIsValid = await user.passwordIsValid(req.body.password)
    if (!passwordIsValid) return res.status(400).json({ status: false, message: "Invalid Credentials!" })

    let token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN
    });

    console.log(user.username, user.firstname)

    res.status(200).send({
      token,
      username: user.username,
      firstName: user.firstname
    });

  } catch (err) {
    return res.status(500).json(err)
  }
}

module.exports = {
  createUser,
  loginUser
}