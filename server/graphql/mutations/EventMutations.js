
'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require("graphql");

const {Event, AccessToken, EventInput} = require("../types/Types.js");

var EventMutations = new GraphQLObjectType({
    name: "EventMutations",
    description: "EventMutations.",
    fields: () => ({
        token: { type: AccessToken },
        newEvent: {
            type: Event,
            args: { eventData: { type: EventInput } },
            resolve: function (parentValue, args, context) {
                const {Event} = context.app.models;
                var data = Object.assign({}, args.eventData);
                data.dateUpdated = new Date();
                data.dateCreated = new Date();
                data.ownerId = parentValue.token.userId;
                return Event.create(data)
                    .then((event) => {
                        return event;
                    })
                    .catch((err) => {
                        return err;
                    });
            }
        },
        updateEvent: {
            type: Event,
            args: { id: { type: new GraphQLNonNull(GraphQLString) }, eventData: { type: EventInput } },
            resolve: function (parentValue, args, context) {
                const {Event} = context.app.models;
                var data = Object.assign({}, args.eventData);
                data.dateUpdated = new Date();

                return Event.findById(args.id)
                    .then((event) => {
                        if (event && event.ownerId == parentValue.token.userId) {
                            return event.updateAttributes(data)
                                .then((event) => {
                                    return event;
                                })
                        }
                        else {
                            return null;
                        }
                    })
                    .catch((err) => {
                        return err;
                    });
            }
        },
        deleteEvent: {
            type: GraphQLString,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: function (parentValue, args, context) {
                const {Event} = context.app.models;

                return Event.findById(args.id)
                    .then((event) => {
                        if (event && event.ownerId == parentValue.token.userId) {
                            return event.destroy()
                                .then((event) => {
                                    return "Event deleted";
                                })
                        }
                        else {
                            return "Event doesnt exist or you do not own the event.";
                        }
                    })
                    .catch((err) => {
                        return err;
                    });
            }
        },
        toggleParticipation: {
            type: GraphQLString,
            args: { eventId: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: function (parentValue, args, context) {
                const {Participation} = context.app.models;
                console.log(args.eventId);
                return Participation
                    .toggleParticipation(parentValue.token.userId, args.eventId)
                    .then((result) => {
                        return result;
                    })
                    .catch((err) => {
                        return err
                    });
            }
        },
        toggleConfirmation: {
            type: GraphQLString,
            args: { eventId: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: function (parentValue, args, context) {
                const {Participation} = context.app.models;
                return Participation
                    .toggleConfirmation(parentValue.token.userId, args.eventId)
                    .then((result) => {
                        return result;
                    })
                    .catch((err) => {
                        return err
                    });
            }
        }
    })
});

exports.EventMutations = EventMutations;