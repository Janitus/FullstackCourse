const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/', (request, response) => {
  console.log("test");
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => {
      console.error("Error fetching blogs:", error);
      response.status(500).send("Error fetching blogs from database");
    });
});

router.get('/api/blogs', (request, response) => {
  console.log("Fetching blogs from backend")
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
});

// https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express
// https://expressjs.com/en/guide/using-middleware.html
router.get('/api/blogs/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Functional

router.post('/', (request, response) => {
  console.log("POST: Received data for new blog:", request.body);
  const blog = new Blog(request.body);

  blog
    .save()
    .then(result => {
      console.log("POST: Saved new blog:", result);
      response.status(201).json(result);
    });
});

router.post('/api/blogs', async (request, response, next) => {
  console.log("POST: Received data for new blog:", request.body);

  if (!request.body.title || !request.body.url) return response.status(400).json({ error: 'no title or url' });

  const blog = new Blog(request.body);
  try {
    const savedBlog = await blog.save();
    response.json(savedBlog.toJSON());
    //console.log("POST: Saved new blog:", result);
  } catch (error) {
    next(error);
  }
});

router.put('/api/blogs/:id', (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
};
/*
router.delete('/api/blogs/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});
*/

router.delete('/api/blogs/:id', async (request, response, next) => {
  console.log("Delete blog with ID: ", request.params.id);

  const deleteBlog = await Blog.findById(request.params.id);
  if (deleteBlog) {
    await deleteBlog.remove();
    response.status(204).end();
  } else {
    response.status(404).send({ error: 'Not found' });
  }

  /*
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.log("Error at deleting: ",error);
    next(error);
  }
  */
});


Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});


module.exports = router;
