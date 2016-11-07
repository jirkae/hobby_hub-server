'use strict';

module.exports = function(Event) {
  Event.findFulltext = (name, desc, callback) => {
    Event.find({
      where: {
        or: [
          {
            "name": new RegExp(name, "i")
          }, {
            "desc": new RegExp(desc, "i")
          }
        ]
      }
    }, (error, events) => {
      if (error) {
        return callback(error);
      }
      return callback(null, events);
    })
  };

  Event.remoteMethod('findFulltext', {
    accepts: [
      {
        arg: 'name',
        type: 'string'
      }, {
        arg: 'desc',
        type: 'string'
      }
    ],
    returns: {
      arg: 'events',
      type: 'string'
    },
    http: {
      verb: 'get'
    }
  });

};
