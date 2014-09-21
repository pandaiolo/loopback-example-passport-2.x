module.exports = function mountStaticDir(server) {

  // -- Mount static files here--
  // All static middleware should be registered at the end, as all requests
  // passing the static middleware are hitting the file system
  // Example:
  var path = require('path');
  var staticDir = path.resolve(__dirname, '../../client/public');
  server.use(server.loopback.static(staticDir));
};
