const Blog = require('../models/blog.model')

const createBlog = async (req, res, next) => {
  try {

    // grab details from the request
    const { title, description, tags, body } = req.body

    const blog = await Blog.findOne({ title })
    if (blog) return res.status(400).json({ status: false, message: "Blog already exists!" })
    // create blog object
    const newBlog = new Blog({
      title,
      description: description || title,
      tags,
      author: req.user._id,
      body,
      owner: req.user.username,
    })
    // save to database
    const createdBlog = await newBlog.save()

    // save blog ID to user document
    req.user.blogs = req.user.blogs.concat(createdBlog._id)
    await req.user.save()

    // return response
    return res.status(201).json({
      status: true,
      data: createdBlog,
    })
  } catch (e) {
    e.source = 'creating a blog'
    next(e)
  }
}

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog
      .find(req.findFilter)
      .select(req.fields)
      .populate('author', { username: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage)

    const pageInfo = req.pageInfo

    return res.json({
      status: true,
      pageInfo,
      data: blogs,
    })
  } catch (err) {
    err.source = 'get published blogs controller'
    next(err)
  }
}

const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id).populate('author')

    if (blog.state !== 'published') {
      return res.status(403).json({
        status: false,
        error: 'Requested article is not published',
      })
    }

    // update blog read count
    blog.read_count += 1
    await blog.save()

    return res.json({
      status: true,
      data: blog,
    })
  } catch (err) {
    err.source = 'get published blog controller'
    next(err)
  }
}

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id)
    Object.assign(blog, req.body)
    await blog.save()
    res.status(200).json({status: true, blog})

  } catch (err) {
    err.source = 'update published blog controller'
    next(err)
  }
}


const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id)

    await blog.remove()
    res.status(200).json({status: true, message: "Blog deleted successfully!"})

  } catch (err) {
    err.source = 'remove published blog controller'
    next(err)
  }
}



module.exports = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog
}