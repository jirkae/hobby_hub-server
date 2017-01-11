'use strict';
var LoopBackContext = require('loopback-context');
var app = require('../../server/server');

module.exports = function (AppUser) {

    AppUser.getCurrentUser = () => {
        return new Promise(function (resolve, reject) {
            var ctx = LoopBackContext.getCurrentContext();
            var currentUser = ctx && ctx.get('currentUser');
            if (currentUser === undefined) {
                return reject(new Error("User is not logged in."));
            }
            var currentUserId = currentUser['id'];

            AppUser.findOne({
                where: {
                    id: currentUserId
                }
            }, (error, user) => {
                if (error) {
                    return reject(error);
                }
                return resolve(user);
            })
        })
    };

    AppUser.remoteMethod('getCurrentUser', {
        accepts: [],
        returns: {
            arg: 'user',
            type: 'array'
        },
        http: {
            verb: 'get'
        }
    });

    AppUser.beforeRemote('prototype.__create__ownEvents', function (ctx, unused, next) {
        ctx.args["data"].dateCreated = new Date();
        ctx.args["data"].dateUpdated = new Date();
        next();
    });

    AppUser.beforeRemote('prototype.__updateById__ownEvents', function (ctx, unused, next) {
        ctx.args["data"].dateUpdated = new Date();
        next();
    });
};
