module.exports = function enableAuthentication(server) {
  var loopback = server.loopback;

  // Some config init
  server.set('views', __dirname + '/../views');
  server.set('view engine', 'ejs');

  // Check if AccessToken relations to custom user model are properly set
  // TODO: should be the job of loopback access-token.js ?
  var userModel = loopback.getModelByType(loopback.User);
  var accessTokenModel = loopback.getModelByType(loopback.AccessToken);
  if (!accessTokenModel.relations.user) {
    accessTokenModel.belongsTo(userModel, {as: 'user'});
  }
  if (!userModel.relations.accessTokens) {
    accessTokenModel.hasMany(accessTokenModel, {as: 'accessTokens'});
  }

};
