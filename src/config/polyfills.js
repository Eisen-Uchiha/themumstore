require('babel-polyfill');

// fetch() polyfill for making API calls.
require('whatwg-fetch');

if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);
}