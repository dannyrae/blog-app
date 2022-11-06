const express = require('express')
const router = express.Router()
const { createBlog, getBlog, getAllBlogs, updateBlog, deleteBlog } = require('../controllers/blog.controller')
const { filterAndSort, filterByPublished, list, setUserFilter } = require('../middleware/filtering')
const verifyToken = require('../middlewares/verifyToken')
const pagination = require('../middleware/pagination')
const isCreator = require('../middleware/isCreator')

router.route('/')
    .get('/', getAllBlogs)
    .get( filterAndSort, setUserFilter, pagination, blogController.getBlogs)

router.post('/create', verifyToken, createBlog)

router.route('/:id')
    .get(getBlog)
    .patch(verifyToken, updateBlog)
    .delete(verifyToken, deleteBlog)

module.exports = router
