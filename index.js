const express = require('express')
// const mongoose = require('mongoose')
const {connectDB} = require('./config/db.config')
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000
app.use(express.json())

connectDB()

// middlewares
app.use('/', userRoute)
app.use('/api', blogRoute)


app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to my Blog Api :)"
    })
})

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))