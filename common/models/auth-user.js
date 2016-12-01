'use strict';
var LoopBackContext = require('loopback-context');
var app = require('../../server/server');

module.exports = function(AuthUser) {
  AuthUser.getCurrentUser = (callback) => {
    //current user
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    var currentUserId = currentUser['id'];

    AuthUser.findOne({
      where: {
        id: currentUserId
      }
    }, (error, user) => {
      if (error) {
        return callback(error);
      }
      return callback(null, user);
    })
  }

  AuthUser.remoteMethod('getCurrentUser', {
    accepts: [],
    returns: {
      arg: 'user',
      type: 'array'
    },
    http: {
      verb: 'get'
    }
  });

  AuthUser.beforeRemote('prototype.__create__ownEvents', function(ctx, unused, next) {
    ctx.args["data"].dateCreated = new Date();
    ctx.args["data"].dateUpdated = new Date();
    next();
  });

  AuthUser.beforeRemote('prototype.__updateById__ownEvents', function(ctx, unused, next) {
    ctx.args["data"].dateUpdated = new Date();
    next();
  });

};
