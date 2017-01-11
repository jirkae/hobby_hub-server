
'use strict';
const {
    GraphQLList,
    GraphQLInt
} = require("graphql");

const {Event} = require("../types/Types.js");

const Events = {
    type: new GraphQLList(Event),
    args: { first: { type: GraphQLInt } },
    resolve: function (rootValue, args, context) {
        const {Event} = context.app.models;
        const {first} = args;
        return Event
            .find({ limit: first, order: "dateCreated DESC", include: ["owner"] })
            .then((events) => { return events })
            .catch((err) => { return err });
    }
}

module.exports = Events;