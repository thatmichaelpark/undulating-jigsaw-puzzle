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
      }, {
        id: 5,
        username: 'admin'
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
        id: 6,
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
        id: 6,
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
              "backgroundColor": "#db9276",
              "hasRotatedPieces": false,
              "id": 1,
              "imageUrl": "/images/seattle.jpg",
              "maxFreq": 2,
              "maxV": 5,
              "maxWaveDepth": 20,
              "nCols": 3,
              "nRows": 2,
              "nWaves": 3,
              "pieceContentSize": 200
          },
          {
              "backgroundColor": "#5979AF",
              "hasRotatedPieces": true,
              "id": 2,
              "imageUrl": "/images/clouds-06.jpg",
              "maxFreq": 5,
              "maxV": 2,
              "maxWaveDepth": 25,
              "nCols": 3,
              "nRows": 2,
              "nWaves": 3,
              "pieceContentSize": 200
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 3,
              "imageUrl": "/images/cat701.jpeg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 4,
              "nRows": 4,
              "nWaves": 2,
              "pieceContentSize": 125
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 4,
              "imageUrl": "/images/wave.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 6,
              "nRows": 4,
              "nWaves": 4,
              "pieceContentSize": 125
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 5,
              "imageUrl": "/images/abstract.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 8,
              "nRows": 6,
              "nWaves": 2,
              "pieceContentSize": 85
          },
          {
              "backgroundColor": "#D8780A",
              "hasRotatedPieces": true,
              "id": 6,
              "imageUrl": "/images/fractal-026.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 5,
              "nRows": 3,
              "nWaves": 2,
              "pieceContentSize": 150
          },
          {
              "backgroundColor": "#F2B5B5",
              "hasRotatedPieces": true,
              "id": 7,
              "imageUrl": "/images/JellyBellyBeans.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 5,
              "nRows": 4,
              "nWaves": 2,
              "pieceContentSize": 120
          },
          {
              "backgroundColor": "#0F74FF",
              "hasRotatedPieces": true,
              "id": 8,
              "imageUrl": "/images/jellyfish.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 6,
              "nRows": 4,
              "nWaves": 2,
              "pieceContentSize": 120
          },
          {
              "backgroundColor": "#EDD2AC",
              "hasRotatedPieces": true,
              "id": 9,
              "imageUrl": "/images/fractal-1119594_960_720.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 9,
              "nRows": 5,
              "nWaves": 3,
              "pieceContentSize": 100
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 10,
              "imageUrl": "/images/blank.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 10,
              "nCols": 9,
              "nRows": 9,
              "nWaves": 3,
              "pieceContentSize": 60
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": true,
              "id": 11,
              "imageUrl": "/images/blank.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 10,
              "nCols": 9,
              "nRows": 9,
              "nWaves": 3,
              "pieceContentSize": 60
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
              "backgroundColor": "#db9276",
              "hasRotatedPieces": false,
              "id": 1,
              "imageUrl": "/images/seattle.jpg",
              "maxFreq": 2,
              "maxV": 5,
              "maxWaveDepth": 20,
              "nCols": 3,
              "nRows": 2,
              "nWaves": 3,
              "pieceContentSize": 200,
              "times": "{\"(663,user4)\",\"(664,user3)\",\"(665,user2)\",\"(666,user1)\"}"
          },
          {
              "backgroundColor": "#5979AF",
              "hasRotatedPieces": true,
              "id": 2,
              "imageUrl": "/images/clouds-06.jpg",
              "maxFreq": 5,
              "maxV": 2,
              "maxWaveDepth": 25,
              "nCols": 3,
              "nRows": 2,
              "nWaves": 3,
              "pieceContentSize": 200,
              "times": "{\"(666,user1)\",\"(667,user2)\",\"(668,user3)\",\"(669,user4)\"}"
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 3,
              "imageUrl": "/images/cat701.jpeg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 4,
              "nRows": 4,
              "nWaves": 2,
              "pieceContentSize": 125,
              "times": "{\"(661,user2)\",\"(662,user4)\",\"(666,user3)\",\"(669,user1)\"}"
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 4,
              "imageUrl": "/images/wave.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 6,
              "nRows": 4,
              "nWaves": 4,
              "pieceContentSize": 125,
              "times": null
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 5,
              "imageUrl": "/images/abstract.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 8,
              "nRows": 6,
              "nWaves": 2,
              "pieceContentSize": 85,
              "times": null
          },
          {
              "backgroundColor": "#D8780A",
              "hasRotatedPieces": true,
              "id": 6,
              "imageUrl": "/images/fractal-026.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 5,
              "nRows": 3,
              "nWaves": 2,
              "pieceContentSize": 150,
              "times": null
          },
          {
              "backgroundColor": "#F2B5B5",
              "hasRotatedPieces": true,
              "id": 7,
              "imageUrl": "/images/JellyBellyBeans.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 5,
              "nRows": 4,
              "nWaves": 2,
              "pieceContentSize": 120,
              "times": null
          },
          {
              "backgroundColor": "#0F74FF",
              "hasRotatedPieces": true,
              "id": 8,
              "imageUrl": "/images/jellyfish.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 6,
              "nRows": 4,
              "nWaves": 2,
              "pieceContentSize": 120,
              "times": null
          },
          {
              "backgroundColor": "#EDD2AC",
              "hasRotatedPieces": true,
              "id": 9,
              "imageUrl": "/images/fractal-1119594_960_720.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 20,
              "nCols": 9,
              "nRows": 5,
              "nWaves": 3,
              "pieceContentSize": 100,
              "times": null
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": false,
              "id": 10,
              "imageUrl": "/images/blank.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 10,
              "nCols": 9,
              "nRows": 9,
              "nWaves": 3,
              "pieceContentSize": 60,
              "times": null
          },
          {
              "backgroundColor": "#ffffff",
              "hasRotatedPieces": true,
              "id": 11,
              "imageUrl": "/images/blank.jpg",
              "maxFreq": 3,
              "maxV": 1,
              "maxWaveDepth": 10,
              "nCols": 9,
              "nRows": 9,
              "nWaves": 3,
              "pieceContentSize": 60,
              "times": null
          }
      ])
      .end(done);
  });
});
