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

const apiRoutes = {
    signupUser = "POST - danny-blog-app.cyclic.app/signup",
    loginUser = "POST - danny-blog-app.cyclic.app/login",
    createBlog = "POST - danny-blog-app.cyclic.app/api/create",
    updateBlog = "PATCH - danny-blog-app.cyclic.app/api/:blogId",
    deleteBlog = "DELETE - danny-blog-app.cyclic.app/api/:blogId",
    getBlog = "GET - danny-blog-app.cyclic.app/api/:blogId",
    getBlogs = "GET - danny-blog-app.cyclic.app/api/",
}

// middlewares
app.use('/', userRoute)
app.use('/api', blogRoute)


app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to my Blog Api :)", apiRoutes
    })
})

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
