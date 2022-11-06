module.exports = async (req, res, next) => {
    try {
      const userBlogs = req.user.blogs.map(id => id.toString())
      const { id } = req.params
      const isPresent = userBlogs.includes(id)
  
      if (!isPresent) {
        return res.status(403).json({
          status: 'fail',
          error: 'Forbidden'
        })
      }
  
      next()
    } catch (err) {
      err.source = 'jwt middleware error'
      next(err)
    }
  }