'use strict';
var https = require('https');

module.exports = function (Event) {

    Event.findFulltext = (query) => {
        return new Promise(function (resolve, reject) {
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
                }).toArray(function (err, results) {
                    if (err) {
                        return reject(err)
                    }

                    var arrayLength = results.length;
                    for (var i = 0; i < arrayLength; i++) {
                        results[i].id = results[i]._id;
                        delete results[i]._id;
                    }
                    return resolve(results);
                });
        })
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

    Event.findByName = (name) => {
        return new Promise(function (resolve, reject) {
            Event.find({
                where: {
                    name: new RegExp(name, "i")
                }
            }, (error, events) => {
                if (error) {
                    return reject(error);
                }
                return resolve(events);
            });
        })
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

    Event.findByDesc = (desc) => {
        return new Promise(function (resolve, reject) {
            Event.find({
                where: {
                    description: new RegExp(desc, "i")
                }
            }, (error, events) => {
                if (error) {
                    return reject(error);
                }
                return resolve(events);
            });
        })
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

    Event.getDistinctTags = (value) => {
        return new Promise(function (resolve, reject) {
            var EventCol = Event.dataSource.connector.collection(Event.modelName);
            EventCol.distinct("tags", (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (value === undefined || value.length < 2) {
                    return reject(new Error("Query value is less than two characters of length."));
                }

                value = value.charAt(0).toUpperCase() + value.slice(1);
                let res = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].constructor === String) {
                        if (results[i].startsWith(value) && results[i].trim() != "") {
                            res.push({
                                name: results[i]
                            });
                        }
                    }
                }
                return resolve(res);
            });
        });
    };

    Event.remoteMethod('getDistinctTags', {
        accepts: [
            {
                arg: 'value',
                type: 'string'
            }
        ],
        returns: {
            arg: 'tags',
            type: 'array'
        },
        http: {
            verb: 'get'
        }
    });

    Event.findByTagsOrCities = (tags, cities) => {
        return new Promise(function (resolve, reject) {
            var EventCol = Event.dataSource.connector.collection(Event.modelName);

            var query;
            var tagsInvalid = (typeof tags === "undefined") || (tags.length == 0);
            var citiesInvalid = (typeof cities === "undefined") || (cities.length == 0);

            if (!tagsInvalid && !citiesInvalid) {
                query = {
                    $and: [
                        {
                            tags: {
                                $in: tags
                            }
                        }, {
                            city: {
                                $in: cities
                            }
                        }
                    ]
                };
            } else if (tagsInvalid && !citiesInvalid) {
                query = {
                    city: {
                        $in: cities
                    }
                };
            } else if (!tagsInvalid && citiesInvalid) {
                query = {
                    tags: {
                        $in: tags
                    }
                };
            } else {
                query = {};
            }

            EventCol.find(query).toArray(function (err, results) {
                if (err) {
                    return reject(err);
                }

                var arrayLength = results.length;
                for (var i = 0; i < arrayLength; i++) {
                    results[i].id = results[i]._id;
                    delete results[i]._id;
                }
                return resolve(results);
            });
        })
    };

    Event.remoteMethod('findByTagsOrCities', {
        accepts: [
            {
                arg: 'tags',
                type: 'array'
            }, {
                arg: 'cities',
                type: 'array'
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

    Event.beforeRemote('prototype.updateAttributes', function (ctx, unused, next) {
        ctx.args["data"].dateUpdated = new Date();
        next();
    });

    Event.getCities = (value) => {
        return new Promise(function (resolve, reject) {
            if (value === undefined || value.length < 2) {
                return reject(new Error("Query too short."));
            }

            var options = {
                hostname: 'maps.googleapis.com',
                path: '/maps/api/place/autocomplete/json?input=' + value + '&types=(cities)&components=country:cz&language=cs_CZ&key=AIzaSyBea5mqFSMMNYVwA7roQZhLFYXlGRHpddc',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            https.get(options, function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    var data = JSON.parse(body);

                    let cities = [];
                    for (var i = 0; i < data.predictions.length; i++) {
                        var prediction = data.predictions[i];
                        cities[i] = {
                            name: prediction.terms[0].value
                        };
                    }

                    return resolve(cities);
                });

            }).on('error', function (e) {
                return reject(e);
            });
        })
    };

    Event.remoteMethod('getCities', {
        accepts: [
            {
                arg: 'value',
                type: 'string'
            }
        ],
        returns: {
            arg: 'cities',
            type: 'array'
        },
        http: {
            verb: 'get'
        }
    });
};
