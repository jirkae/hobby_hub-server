'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");

const {Tag} = require("../types/Types.js");

const Cities = {
    type: new GraphQLList(Tag),
    args: { Query: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: function (rootValue, args, context) {
        const {Event} = context.app.models;
        const {Query} = args;

        return Event
            .getCities(Query)
            .then((tags) => {
                return tags;
            })
            .catch((err) => {
                return err;
            })
    }
}

module.exports = Cities;