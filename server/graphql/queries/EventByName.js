'use strict';
const {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} = require("graphql");

const {Event} = require("../types/Types.js");

const EventByName = {
    type: new GraphQLList(Event),
    args: { Name: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: function (rootValue, args, context) {
        const {Event} = context.app.models;
        const {Name} = args;

        return Event
            .findByName(Name)
            .then((events) => { return events })
            .catch((err) => { return err });
    }
}

module.exports = EventByName;