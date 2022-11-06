const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization
        if(!bearerHeader || typeof bearerHeader == 'undefined') return res.status(403).json({status: false, message: "Token field in header is empty"})

        const bearerToken = bearerHeader.split(" ")[1]
        req.token = bearerToken

        const userFromToken = jwt.verify(req.token, process.env.JWT_SECRET)
        const user = await User.findById(userFromToken.id)

        if (!user) return res.status(500).json({status: false, error: 'Invalid token!'})

        req.user = user
        next()

    } catch (err) {
        err = 'Token field in header is empty'
        next(err)
    }
}