'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/not-quite-jigsaw_dev'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/not-quite-jigsaw_test'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
