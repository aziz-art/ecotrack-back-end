const request = require('supertest');
const app = require('../server'); // Adjust if your server export is different

describe('Tours API', () => {
  it('GET /tours should return 200', async () => {
    const res = await request(app).get('/tours');
    expect(res.statusCode).toEqual(200);
  });

  it('POST /tours should return 200', async () => {
    const res = await request(app)
      .post('/tours')
      .send({ name: 'Test Tour' });
    expect(res.statusCode).toEqual(200);
  });
});
