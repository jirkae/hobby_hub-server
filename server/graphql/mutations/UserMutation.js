
'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require("graphql");

const {UserMutations} = require("./UserMutations.js");

const UserMutation = {
    type: UserMutations,
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

module.exports = UserMutation;