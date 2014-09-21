module.exports = function bootPassportConfigurator(server) {
  // Passport configurators..
  var loopbackPassport = require('loopback-component-passport');
  var PassportConfigurator = loopbackPassport.PassportConfigurator;
  var passportConfigurator = new PassportConfigurator(server);

  // attempt to build the providers/passport config
  var config = {};
  try {
    config = require('../../providers.json');
  } catch (err) {
    console.trace(err);
    process.exit(1); // fatal
  }

  passportConfigurator.init();

  passportConfigurator.setupModels({
    userModel: server.models.AppUser,
    userIdentityModel: server.models.UserIdentity,
    userCredentialModel: server.models.UserCredential
  });

  for (var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }
};
