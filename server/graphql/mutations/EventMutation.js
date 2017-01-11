
'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require("graphql");

const {EventMutations} = require("./EventMutations.js");

const EventMutation = {
    type: EventMutations,
    args: { token: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: function (rootValue, args, context) {
        const {AccessToken} = context.app.models;
        return AccessToken
            .findById(args.token)
            .then((token) => {
                if (token) {
                    return { token: token };
                }
                else {
                    return null;
                }
            })
    }
}

module.exports = EventMutation;