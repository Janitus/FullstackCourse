const supertest = require('supertest');
const app = require('../../index'); //require('../app');
const api = supertest(app);

test('a user with password shorter than 3 cannot be added', async () => {
    const users = await api.get('/api/users');
    const usersAmount = users.body.length

    const max = 9999999999
    const min = 1
    const randomUsername = Math.floor(Math.random() * (max - min + 1) + min).toString()

    const newUser = {
        username: randomUsername,
        name: "test",
        password: "a"
      };

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    const usersAtEnd = await api.get('/api/users');
    expect(usersAtEnd.body).toHaveLength(usersAmount);
});

test('a user with username shorter than 3 cannot be added', async () => {
    const users = await api.get('/api/users');
    const usersAmount = users.body.length

    const newUser = {
        username: "u",
        name: "test",
        password: "abcabc"
      };

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    const usersAtEnd = await api.get('/api/users');
    expect(usersAtEnd.body).toHaveLength(usersAmount);
});

test('a user with the same username as pre-existing user cannot be added', async () => {
    const users = await api.get('/api/users');
    const usersAmount = users.body.length

    const newUser = {
        username: "AlreadyExist",
        name: "test",
        password: "abcabc"
      };

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    const usersAtEnd = await api.get('/api/users');
    expect(usersAtEnd.body).toHaveLength(usersAmount);
});

