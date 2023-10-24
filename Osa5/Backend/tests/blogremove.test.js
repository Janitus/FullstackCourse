const supertest = require('supertest');
const app = require('../index'); //require('../app');
const api = supertest(app);

test('a blog can be deleted', async () => {
    const blogs = await api.get('/api/blogs');
    const blogsAmount = blogs.body.length

    //console.log("Current blogs:", blogs.body);

    if(blogsAmount == 0) {
        expect(blogsAtEnd.body).toHaveLength(0)
        return
    }

    console.log("test first blog: ", blogs.body[0]);
    const deleteBlog = blogs.body[0].id;
    console.log("test delete id: ",deleteBlog);


    await api
        //.delete(`/api/blogs/${deleteBlog.id}`)
        .delete(`/api/blogs/`+deleteBlog)
        .expect(204);

    const blogsAtEnd = await api.get('/api/blogs');
    expect(blogsAtEnd.body).toHaveLength(blogsAmount - 1);
});
