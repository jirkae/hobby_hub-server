'use strict';

module.exports = function(Event) {
  Event.findFulltext = (query, callback) => {
    var EventCol = Event.dataSource.connector.collection(Event.modelName);
    EventCol.find({
      $text: {
        $search: query
      }
    }, {
      score: {
        $meta: "textScore"
      }
    }).sort({
      score: {
        $meta: "textScore"
      }
    }).toArray(function(err, results) {
      if (err) {
        return callback(err)
      }

      var arrayLength = results.length;
      for (var i = 0; i < arrayLength; i++) {
        results[i].id = results[i]._id;
        delete results[i]._id;
      }
      return callback(null, results);
    });
  };

  Event.remoteMethod('findFulltext', {
    accepts: [
      {
        arg: 'query',
        type: 'string'
      }
    ],
    returns: {
      arg: 'events',
      type: 'array'
    },
    http: {
      verb: 'get'
    }
  });

  Event.findByName = (name, callback) => {
    Event.find({
      where: {
        name: new RegExp(name, "i")
      }
    }, (error, events) => {
      if (error) {
        return callback(error);
      }
      return callback(null, events);
    });
  };

  Event.remoteMethod('findByName', {
    accepts: [
      {
        arg: 'name',
        type: 'string'
      }
    ],
    returns: {
      arg: 'events',
      type: 'array'
    },
    http: {
      verb: 'get'
    }
  });

  Event.findByDesc = (desc, callback) => {
    Event.find({
      where: {
        description: new RegExp(desc, "i")
      }
    }, (error, events) => {
      if (error) {
        return callback(error);
      }
      return callback(null, events);
    });
  };

  Event.remoteMethod('findByDesc', {
    accepts: [
      {
        arg: 'desc',
        type: 'string'
      }
    ],
    returns: {
      arg: 'events',
      type: 'array'
    },
    http: {
      verb: 'get'
    }
  });

};
