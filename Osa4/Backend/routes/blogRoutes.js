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
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
});


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
  const blog = new Blog(request.body);

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});


router.put('/api/blogs/:id', (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
};

router.delete('/api/blogs/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});


Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});


module.exports = router;
