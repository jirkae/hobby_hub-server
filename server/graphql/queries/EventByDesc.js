'use strict';
const {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} = require("graphql");

const {Event} = require("../types/Types.js");

const EventByDesc = {
    type: new GraphQLList(Event),
    args: { Desc: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: function (rootValue, args, context) {
        const {Event} = context.app.models;
        const {Desc} = args;

        return Event
            .findByDesc(Desc)
            .then((events) => { return events })
            .catch((err) => { return err });
    }
}

module.exports = EventByDesc;