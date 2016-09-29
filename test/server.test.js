/* eslint-disable max-lines */
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
  test('POST /api/users (invalid username)', (done) => {
    supertest(app)
      .post('/api/users')
      .set('Accept', 'application/json, */*')
      .send({
        username: 'Stan Lee',
        password: 'password'
      })
      .expect(400, 'validation error')
      .expect('Content-Type', /text/)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test('PATCH /api/users/1', (done) => {
    supertest(app)
      .patch('/api/users/1')
      .set('Accept', 'application/json, */*')
      .send({
        username: 'New',
      })
      .expect(200, {
        id: 1,
        username: 'New'
      })
      .expect('Content-Type', /json/)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

suite('puzzles routes', () => {
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
  test('GET /api/puzzles', (done) => {
    supertest(app)
      .get('/api/puzzles')
      .set('Accept', 'application/json, */*')
      .expect('Content-Type', /json/)
      .expect((result) => {
        const puzzles = result.body;

        puzzles.forEach((puzzle) => {
          delete puzzle.createdAt;
          delete puzzle.updatedAt;
        });
      })
      .expect(200, [
        {
          backgroundColor: '#db9276',
          hasRotatedPieces: false,
          id: 1,
          imageUrl: '/images/seattle.jpg',
          maxFreq: 2,
          maxV: 0.5,
          maxWaveDepth: 20,
          nCols: 3,
          nRows: 2,
          nWaves: 3,
          pieceContentSize: 200
        },
        {
          backgroundColor: '#5979AF',
          hasRotatedPieces: false,
          id: 2,
          imageUrl: '/images/clouds-06.jpg',
          maxFreq: 5,
          maxV: 0.5,
          maxWaveDepth: 15,
          nCols: 4,
          nRows: 3,
          nWaves: 3,
          pieceContentSize: 150
        },
        {
          backgroundColor: 'white',
          hasRotatedPieces: false,
          id: 3,
          imageUrl: '/images/cat800.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 4,
          nRows: 4,
          nWaves: 2,
          pieceContentSize: 150
        },
        {
          backgroundColor: '#D8780A',
          hasRotatedPieces: true,
          id: 4,
          imageUrl: '/images/fractal-026.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 5,
          nRows: 3,
          nWaves: 2,
          pieceContentSize: 150
        },
        {
          backgroundColor: '#F2B5B5',
          hasRotatedPieces: true,
          id: 5,
          imageUrl: '/images/JellyBellyBeans.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 5,
          nRows: 4,
          nWaves: 2,
          pieceContentSize: 120
        },
        {
          backgroundColor: '#0F74FF',
          hasRotatedPieces: true,
          id: 6,
          imageUrl: '/images/jellyfish.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 6,
          nRows: 4,
          nWaves: 2,
          pieceContentSize: 120
        },
        {
          backgroundColor: '#EDD2AC',
          hasRotatedPieces: true,
          id: 7,
          imageUrl: '/images/fractal-1119594_960_720.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 9,
          nRows: 5,
          nWaves: 3,
          pieceContentSize: 100
        },
        {
          backgroundColor: 'black',
          hasRotatedPieces: true,
          id: 8,
          imageUrl: '/images/black.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 10,
          nCols: 9,
          nRows: 9,
          nWaves: 3,
          pieceContentSize: 50
        }
      ])
      .end(done);
  });
  test('GET /api/puzzles/full', (done) => {
    supertest(app)
      .get('/api/puzzles/full')
      .set('Accept', 'application/json, */*')
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          backgroundColor: '#db9276',
          hasRotatedPieces: false,
          id: 1,
          imageUrl: '/images/seattle.jpg',
          maxFreq: 2,
          maxV: 0.5,
          maxWaveDepth: 20,
          nCols: 3,
          nRows: 2,
          nWaves: 3,
          pieceContentSize: 200,
          times: '{"(663,user4)","(664,user3)","(665,user2)","(666,user1)"}'
        },
        {
          backgroundColor: '#5979AF',
          hasRotatedPieces: false,
          id: 2,
          imageUrl: '/images/clouds-06.jpg',
          maxFreq: 5,
          maxV: 0.5,
          maxWaveDepth: 15,
          nCols: 4,
          nRows: 3,
          nWaves: 3,
          pieceContentSize: 150,
          times: '{"(666,user1)","(667,user2)","(668,user3)","(669,user4)"}'
        },
        {
          backgroundColor: 'white',
          hasRotatedPieces: false,
          id: 3,
          imageUrl: '/images/cat800.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 4,
          nRows: 4,
          nWaves: 2,
          pieceContentSize: 150,
          times: null
        },
        {
          backgroundColor: '#D8780A',
          hasRotatedPieces: true,
          id: 4,
          imageUrl: '/images/fractal-026.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 5,
          nRows: 3,
          nWaves: 2,
          pieceContentSize: 150,
          times: null
        },
        {
          backgroundColor: '#F2B5B5',
          hasRotatedPieces: true,
          id: 5,
          imageUrl: '/images/JellyBellyBeans.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 5,
          nRows: 4,
          nWaves: 2,
          pieceContentSize: 120,
          times: null
        },
        {
          backgroundColor: '#0F74FF',
          hasRotatedPieces: true,
          id: 6,
          imageUrl: '/images/jellyfish.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 6,
          nRows: 4,
          nWaves: 2,
          pieceContentSize: 120,
          times: '{"(661,user2)","(662,user4)","(666,user3)","(669,user1)"}'
        },
        {
          backgroundColor: '#EDD2AC',
          hasRotatedPieces: true,
          id: 7,
          imageUrl: '/images/fractal-1119594_960_720.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 20,
          nCols: 9,
          nRows: 5,
          nWaves: 3,
          pieceContentSize: 100,
          times: null
        },
        {
          backgroundColor: 'black',
          hasRotatedPieces: true,
          id: 8,
          imageUrl: '/images/black.jpg',
          maxFreq: 3,
          maxV: 1,
          maxWaveDepth: 10,
          nCols: 9,
          nRows: 9,
          nWaves: 3,
          pieceContentSize: 50,
          times: null
        }
      ])
      .end(done);
  });
});
