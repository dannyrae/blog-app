const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(console.log("Connected to database successfully!"))
    .catch( err => console.log(err))
}

module.exports = { connectDB }
