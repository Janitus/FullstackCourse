const supertest = require('supertest');
const app = require('../index'); //require('../app');
const api = supertest(app);


test('blogs can be added successfully', async () => {
    const bodyResponse = await api.get('/api/blogs');
    const blogAmount = bodyResponse.body.length;

    const newBlog = {
      title: 'TESTTITLE',
      author: 'asdsadasd',
      url: 'asdsadsadasd',
      likes: 1
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);
  
    expect(response.body).toHaveLength(blogAmount + 1);
    expect(titles).toContain('TESTTITLE');
  });
  
  

test('missing likes defaults to 0', async () => {
    const newBlog = {
      title: 'UnpopularTest',
      author: 'Tester',
      url: 'http://Ihavenolikes.:('
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body.likes).toBe(0);
  });


test('missing title returns 400 Bad Request', async () => {
    const testBlog = {
      author: 'Tester',
      url: 'http://missingtitle.com',
    };

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(400);
  });
  
test('missing url returns 400 Bad Request', async () => {
    const testBlog = {
      title: 'Missing URL',
      author: 'Tester',
    };
  
    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(400);
  });