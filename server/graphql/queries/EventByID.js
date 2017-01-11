'use strict';
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const {Event} = require("../types/Types.js");

const EventByID = {
    type: Event,
    args: { EventID: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: function (rootValue, args, context) {
        const {Event} = context.app.models;
        const {EventID} = args;

        return Event
            .findById(EventID)
            .then((event) => { return event })
            .catch((err) => { return err });
    }
}

module.exports = EventByID;