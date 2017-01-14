'use strict';
var LoopBackContext = require('loopback-context');
var app = require('../../server/server');

module.exports = function (Participation) {

  Participation.toggleParticipation = (userId, eventId, token) => {
    return new Promise(function (resolve, reject) {
      //user check
      var ctx = LoopBackContext.getCurrentContext();
      var currentUser = ctx && ctx.get('currentUser');
      var currentUserId;
      if (currentUser) {
        currentUserId = currentUser['id'];
      }
      else {
        currentUserId = token.userId;
      }

      //is there any such event?
      var Event = app.models.Event;
      Event.find({
        where: {
          id: eventId
        }
      }, (error, result) => {
        if (!result || result.length == 0) {
          return reject(new Error("Event not in database"));
        }

        //is the user the current authenticated user?
        if (userId == currentUserId) {
          Participation.find({
            where: {
              and: [
                {
                  participantId: userId
                }, {
                  eventId: eventId
                }
              ]
            }
          }, (err, models) => {
            if (error) {
              return reject(error);
            }
            if (models && (models.length > 0)) {
              if (models[0].state == "pending") {
                //cancel participation
                Participation.destroyById(models[0].id, (err) => {
                  if (err) {
                    return reject(error);
                  }
                  return resolve("Participation request cancelled.");
                });
              } else {
                return resolve("You are already confirmed for this event.");
              }
            } else {
              //participate
              var record = {
                "participantId": userId,
                "eventId": eventId
              };
              Participation.create(record, (err, models) => {
                if (err) {
                  return reject(err);
                }
                return resolve(models);
              });
            }
          });
        }
        else {
          return resolve("Wrong user.");
        }
      })
    })
  };

  Participation.remoteMethod('toggleParticipation', {
    accepts: [
      {
        arg: 'userId',
        type: 'string'
      }, {
        arg: 'eventId',
        type: 'string'
      }
    ],
    returns: {
      arg: 'response',
      type: 'array'
    },
    http: {
      verb: 'put'
    }
  });

  Participation.toggleConfirmation = (userId, eventId, token) => {
    return new Promise(function (resolve, reject) {
      //currentUser
      var ctx = LoopBackContext.getCurrentContext();
      var currentUser = ctx && ctx.get('currentUser');
      var currentUserId;
      if (currentUser) {
        currentUserId = currentUser['id'];
      }
      else {
        currentUserId = token.userId;
      }

      //is there any such event?
      var Event = app.models.Event;
      Event.findOne({
        where: {
          id: eventId
        }
      }, (error, result) => {
        if (!result) {
          return resolve("There is no such event!");
        }

        //does the user own the event?
        if (result.ownerId.str === currentUserId.str) {
          Participation.findOne({
            where: {
              and: [
                {
                  participantId: userId
                }, {
                  eventId: eventId
                }
              ]
            }
          }, (err, result) => {
            if (error) {
              return reject(error);
            }
            if (result) {
              if (result.state == "pending") {
                //confirm participation
                var updatedAttributes = {
                  "state": "confirmed"
                };

                result.updateAttributes(updatedAttributes, (err, obj) => {
                  if (err) {
                    return reject(err);
                  }
                  return resolve("Participation request confirmed.");
                });
              } else {
                //unconfirm participation
                var updatedAttributes = {
                  "state": "pending"
                };

                result.updateAttributes(updatedAttributes, (err, obj) => {
                  if (err) {
                    return reject(err);
                  }
                  return resolve("Participation request unconfirmed.");
                });
              }
            }
            else {
              return resolve("There is no such participation.");
            }
          });
        } else {
          return resolve("Not authorized. You do not own the event.");
        }
      })
    })
  };

  Participation.remoteMethod('toggleConfirmation', {
    accepts: [
      {
        arg: 'userId',
        type: 'string'
      }, {
        arg: 'eventId',
        type: 'string'
      }
    ],
    returns: {
      arg: 'response',
      type: 'array'
    },
    http: {
      verb: 'put'
    }
  });
};
