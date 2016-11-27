'use strict';
var LoopBackContext = require('loopback-context');
var app = require('../../server/server');

module.exports = function(Participation) {
  Participation.toggleParticipation = (userId, eventId, callback) => {
    //user check
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    var currentUserId = currentUser['id'];

    //is there any such event?
    var Event = app.models.Event;
    Event.find({
      where: {
        id: eventId
      }
    }, (error, result) => {
      if (!result || result.length == 0) {
        return callback(null, "Unknown event (not in database).");
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
            return callback(error);
          }
          if (models && (models.length > 0)) {
            if (models[0].state == "pending") {
              //cancel participation
              Participation.destroyById(models[0].id, (err) => {
                if (err) {
                  return callback(err);
                }
                return callback(null, "Participation request cancelled.");
              });
            } else {
              return callback(null, "You are already confirmed for this event.");
            }
          } else {
            //participate
            var record = {
              "participantId": userId,
              "eventId": eventId
            };
            Participation.create(record, (err, models) => {
              if (err) {
                return callback(err);
              }
              return callback(null, models);
            });
          }
        });
      }
    })
  }

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

  Participation.toggleConfirmation = (userId, eventId, callback) => {
    //currentUser
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    var currentUserId = currentUser['id'];

    //is there any such event?
    var Event = app.models.Event;
    Event.find({
      where: {
        id: eventId
      }
    }, (error, result) => {
      if (!result || result.length == 0) {
        return callback(null, "Unknown event (not in database).");
      }

      //does the user own the event?
      if (result[0].ownerId.str === currentUserId.str) {
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
            return callback(error);
          }
          if (models && (models.length > 0)) {
            if (models[0].state == "pending") {
              //confirm participation
              var record = {
                "id": models[0].id,
                "participantId": userId,
                "eventId": eventId,
                "state": "confirmed"
              };

              Participation.upsert(record, (err, obj) => {
                if (err) {
                  return callback(err);
                }
                return callback(null, "Participation request confirmed.");
              });
            } else {
              //unconfirm participation
              var record = {
                "id": models[0].id,
                "participantId": userId,
                "eventId": eventId,
                "state": "pending"
              };

              Participation.upsert(record, (err, obj) => {
                if (err) {
                  return callback(err);
                }
                return callback(null, "Participation request unconfirmed.");
              });
            }
          }
          else
          {
            return callback(null, "There is no such participation.");
          }
        });
      } else {
        return callback(null, "Not authorized. You do not own the event.");
      }
    })
  }

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
