const supertest = require('supertest');
const app = require('../index'); //require('../app');
const api = supertest(app);

test('a blog can be liked', async () => {
  const blogs = await api.get('/api/blogs');
  const blogsAmount = blogs.body.length

  if(blogsAmount == 0) {
      expect(blogsAtEnd.body).toHaveLength(0)
      return
  }

  const currentLikes = await blogs.body[0].likes;
  const blogToLike = blogs.body[0].id;

  await api.put("/api/blogs/"+blogToLike+"/like").expect(200);

  const afterBlog = await api.get('/api/blogs');
  const afterLikeBlogs = await afterBlog.body[0].likes;

  console.log("Likes are: ",currentLikes, afterLikeBlogs)
  expect(afterLikeBlogs).toBe(currentLikes + 1);
});
