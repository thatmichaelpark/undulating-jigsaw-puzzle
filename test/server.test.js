'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const app = require('../server');
const knex = require('../knex');
const supertest = require('supertest');

suite('users routes', () => {
  before((done) => { // eslint-disable-line no-undef
    knex.migrate.latest()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  beforeEach((done) => { // eslint-disable-line no-undef
    knex.seed.run()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test('GET /api/users', (done) => {
    supertest(app)
      .get('/api/users')
      .set('Accept', 'application/json, */*')
      .expect('Content-Type', /json/)
      .expect(200, [{
        id: 1,
        username: 'user1'
      }, {
        id: 2,
        username: 'user2'
      }, {
        id: 3,
        username: 'user3'
      }, {
        id: 4,
        username: 'user4'
      }])
      .end(done);
  });
  test('POST /api/users', (done) => {
    supertest(app)
      .post('/api/users')
      .set('Accept', 'application/json, */*')
      .send({
        username: 'StanLee',
        password: 'password'
      })
      .expect(200, {
        id: 5,
        username: 'StanLee'
      })
      .expect('Content-Type', /json/)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test('POST /api/users (duplicate)', (done) => {
    supertest(app)
      .post('/api/users')
      .set('Accept', 'application/json, */*')
      .send({
        username: 'StanLee',
        password: 'password'
      })
      .expect(200, {
        id: 5,
        username: 'StanLee'
      })
      .expect('Content-Type', /json/)
      .then(() => {
        supertest(app)
        .post('/api/users')
        .set('Accept', 'application/json, */*')
        .send({
          username: 'StanLee',
          password: 'password'
        })
        .expect(400, 'Username already exists')
        .expect('Content-Type', /text/);
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
