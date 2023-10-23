const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getTokenFrom } = require('../middleware/middlewares.js');

router.delete('/test', (req, res) => {
  console.log("Test DELETE route hit");
  res.status(200).send("Test DELETE route");
});

router.delete('/:id', async (request, response, next) => {
  console.log("Delete");
  const id = request.params.id
  console.log("Delete blog with ID: ", id);

  if(!id || id === "undefined") return response.status(400).json({ error: 'Missing ID'});

  try {
    const blogToFind = await Blog.findByIdAndRemove(id);
    console.log("Blog to find: ", blogToFind)
    if (blogToFind) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    next(error);
  }

});

// https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express
// https://expressjs.com/en/guide/using-middleware.html
router.get('/:id', (request, response, next) => { // router.get('/api/blogs/:id', (request, response, next) => {
  console.log("Get by ID");
  Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .then(blog => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

router.get('/', (request, response) => {
  console.log("All blogs");
  Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => {
      console.error("Error fetching blogs:", error);
      response.status(500).send("Error fetching blogs");
    });
});




router.post('/', async (request, response, next) => {
  console.log("POST: Received data for new blog: ", request.body);
  const body = request.body;

  if (!body.title || !body.url) return response.status(400).json({ error: "no title or url" });

  let decodedToken
  try {
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  } catch (error) {
    console.log("Error: Invalid token in post")
    return response.status(401).json({ error: 'token invalid' })
  }



  const user = await User.findById(decodedToken.id)
  //const user = await User.findOne(); // https://www.geeksforgeeks.org/mongodb-findone-method/

  if(!user) return response.status(400).json({ error: "Couldn't find a user to assign the author" });

  const blog = new Blog({
    title: body.title,
    author: user.name, //body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });


  try {
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id); // user.notes = user.notes.concat(savedNote._id)
    await user.save();

    response.json(savedBlog);

    //response.status(201).json(savedBlog.toJSON());
    //console.log("POST: Saved new blog:", savedBlog);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/like', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) return response.status(404).json({ error: "Not found" });
    
    blog.likes += 1;
    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
};


Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});


module.exports = router;
