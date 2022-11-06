const express = require('express')
const router = express.Router()
const { createBlog, getBlog, getAllBlogs, updateBlog, deleteBlog } = require('../controllers/blog.controller')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', getAllBlogs)

router.post('/create', verifyToken, createBlog)

router.route('/:id')
    .get(getBlog)
    .patch(verifyToken, updateBlog)
    .delete(verifyToken, deleteBlog)

module.exports = router