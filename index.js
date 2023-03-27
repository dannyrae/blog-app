const express = require('express')
const {connectDB} = require('./config/db.config')
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000
app.use(express.json())

connectDB()

// middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next()
})
app.use('/', userRoute)
app.use('/api', blogRoute)


app.get('/', (req, res) => {
    const apiRoutes = {
    signup : "POST - danny-blog-app.cyclic.app/signup",
    login : "POST - danny-blog-app.cyclic.app/login",
    create_blog : "POST - danny-blog-app.cyclic.app/api/create",
    update_blog : "PATCH - danny-blog-app.cyclic.app/api/:blogId",
    delete_blog : "DELETE - danny-blog-app.cyclic.app/api/:blogId",
    get_blog : "GET - danny-blog-app.cyclic.app/api/:blogId",
    get_blogs : "GET - danny-blog-app.cyclic.app/api/",
}
    res.status(200).json({
        status: true,
        message: "Welcome to my Blog Api :)", apiRoutes
    })
})

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
