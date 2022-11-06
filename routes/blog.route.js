const express = require('express')
const router = express.Router()
const { createBlog, getBlog, getAllBlogs, updateBlog, deleteBlog } = require('../controllers/blog.controller')
const { filterAndSort, filterByPublished, list, setUserFilter } = require('../middlewares/filtering')
const verifyToken = require('../middlewares/verifyToken')
const pagination = require('../middlewares/pagination')
const isCreator = require('../middlewares/isCreator')

router.route('/')
    .get(filterAndSort, setUserFilter, pagination, getAllBlogs)

router.post('/create', verifyToken, createBlog)

router.route('/:id')
    .get(getBlog)
    .patch(verifyToken, updateBlog)
    .delete(verifyToken, deleteBlog)

module.exports = router
