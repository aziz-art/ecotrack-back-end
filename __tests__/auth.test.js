const request = require('supertest');
const app = require('../server'); // Adjust if your server export is different

describe('Auth API', () => {
  it('POST /auth/login should return 200', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toEqual(200);
  });

  it('POST /auth/logout should return 200', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.statusCode).toEqual(200);
  });
});
