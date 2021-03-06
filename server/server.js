'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var LoopBackContext = require('loopback-context');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
      console.log('...and your GraphiQL at /graphql');
    }
  });
};

//Set current user // refactor
app.use(LoopBackContext.perRequest());
app.use(loopback.token());
app.use(function setCurrentUser(req, res, next) {
  
  if (!req.accessToken) {
    return next();
  }

  app.models.AppUser.findById(req.accessToken.userId, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('No user with this access token was found.'));
    }
    var loopbackContext = LoopBackContext.getCurrentContext();
    if (loopbackContext) {
      loopbackContext.set('currentUser', user);
    }
    next();
  });
});

//GraphQL // refactor
const graphqlHTTP = require('express-graphql');
const hobbySchema = require('./graphql/HobbyHubSchema.js');

app.use('/graphql', graphqlHTTP({
  schema: hobbySchema,
  graphiql: true
}));

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module || GLOBAL.PhusionPassenger)
    app.start();
});
