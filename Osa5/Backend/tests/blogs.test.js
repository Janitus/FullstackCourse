const supertest = require('supertest');
const app = require('../index'); //require('../app');
const api = supertest(app);

api.get('/api/blogs')
   .then(response => {
       expect(response.status).toBe(200);
       expect(response.headers['content-type']).toBe('application/json; charset=utf-8');

       //Expected: "application/json"
       //Received: "application/json; charset=utf-8"
   });

// NOTEA ITELLENI: Testi failaa, jos backend servu on päällä. Muuten toimii. Toki hakee tällä hetkellä mongosta joten ei toimi heti kun lisäilen sinne lisää. Muista muuttaa.
test('three blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(3);
});

test('blogs are json and have id as "id"', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
  expect(response.body[0]._id).toBeUndefined();
});


