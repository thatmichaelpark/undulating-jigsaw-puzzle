'use strict';

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'app.js': /^app\//,
        'vendor.js': /^node_modules\//
      }
    },

    stylesheets: {
      joinTo: {
        'app.css': /^app\//
      }
    }
  },

  plugins: {
    babel: {
      presets: ['es2015', 'react']
    }
  },

  server: {
    command: 'nodemon --ignore app --ignore public server.js'
  }
};
