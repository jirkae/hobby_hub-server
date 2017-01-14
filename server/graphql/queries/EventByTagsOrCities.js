'use strict';
const {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} = require("graphql");

const {Event} = require("../types/Types.js");

const EventByTagsOrCities = {
    type: new GraphQLList(Event),
    args: { tags: { type: new GraphQLList(GraphQLString) },
            cities: { type: new GraphQLList(GraphQLString) } },
    resolve: function (rootValue, args, context) {
        const {Event} = context.app.models;
        const {tags, cities} = args;

        return Event
            .findByTagsOrCities(tags, cities)
            .then((events) => { return events })
            .catch((err) => { return err });
    }
}

module.exports = EventByTagsOrCities;