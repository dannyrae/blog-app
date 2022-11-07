const Blog = require('../models/blog.model')

const createBlog = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body

    const blog = await Blog.findOne({ title })
    if (blog) return res.status(400).json({ status: false, message: "Blog already exists!" })

    const newBlog = new Blog({
      title,
      description: description,
      tags,
      author: req.user._id,
      body,
      owner: req.user.username,
    })

    const createdBlog = await newBlog.save()
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

const getPublishedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({state: 'published'}).sort({createdAt: 1}).skip(0).limit(20)
    const pageInfo = blogs.length

    res.status(200).json({
      status: true,
      pageInfo,
      data: blogs
    })
    
  } catch (err) {
    err.source = 'get published blogs controller'
    next(err)
  }
}

const getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({state: req.query.state}).where({author: req.user}).skip(0).limit(20)
    const numberOfContents = blogs.length

    res.status(200).json({
      status: true,
      numberOfContents,
      data: blogs
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
  deleteBlog,
  getPublishedBlogs,
  getUserBlogs
}
