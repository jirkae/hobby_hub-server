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

  Event.findByTagsOrCity = (tags, city, callback) => {
    var EventCol = Event.dataSource.connector.collection(Event.modelName);

    var query;

    var tagInvalid = (typeof tags === "undefined") || (tags.length == 0);
    var cityInvalid = (typeof city === "undefined") || (city.trim() == "");

    if (!tagInvalid && !cityInvalid) {
      query = {
        $and: [
          {
            tags: {
              $in: tags
            }
          }, {
            "city": city
          }
        ]
      };
    } else if (tagInvalid && !cityInvalid) {
      query = {
        "city": city
      };
    } else if (!tagInvalid && cityInvalid) {
      query = {
        tags: {
          $in: tags
        }
      };
    } else {
      query = {};
    }

    EventCol.find(query).toArray(function(err, results) {
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

  Event.remoteMethod('findByTagsOrCity', {
    accepts: [
      {
        arg: 'tags',
        type: 'array'
      }, {
        arg: 'city',
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

  Event.beforeRemote('prototype.updateAttributes', function(ctx, unused, next) {
    ctx.args["data"].dateUpdated = new Date();
    next();
  });

};
