module.exports = function mountAppRoutes(server) {
  var loopback = server.loopback;
  var router = loopback.Router();

  server.use(loopback.cookieParser(server.get('cookieSecret')));
  server.use(loopback.session({
    secret: 'kitty',
    saveUninitialized: true,
    resave: true
  }));

  server.use(loopback.token());

  // Modified from https://github.com/jaredhanson/connect-ensure-login
  // to add loopback user to req
  function ensureLoggedIn(options) {
    if (typeof options == 'string') {
      options = { redirectTo: options }
    }
    options = options || {};
    var url = options.redirectTo || '/login.html';
    var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

    return function(req, res, next) {
      if (!req.accessToken) {
        if (setReturnTo && req.session) {
          req.session.returnTo = req.originalUrl || req.url;
        }
        return res.redirect(url);
      }
      var UserModel = loopback.getModelByType(server.models.AccessToken).relations.user.modelTo;
      UserModel.findById(req.accessToken.userId, function (err, user) {
        req.user = user;
        next();
      });
    };
  }

  router.get('/', function(req, res, next) {
    // TODO: find a way to make req.user available here
    res.render('index', {user: req.user});
  });

  router.get('/auth/account', ensureLoggedIn(), function(req, res, next) {
    res.render('loginProfiles', {user: req.user});
  });

  router.get('/link/account', ensureLoggedIn(), function(req, res, next) {
    res.render('linkedAccounts', {user: req.user});
  });

  router.get('/auth/logout', ensureLoggedIn(), function(req, res, next) {
    req.logout();
    res.redirect('/');
  });

  server.use(router);
};
