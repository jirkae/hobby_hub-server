'use strict';
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const {AppUser} = require("../types/Types.js");

const UserByID = {
    type: AppUser,
    args: { UserID: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: function (rootValue, args, context) {
        const {AppUser} = context.app.models;
        const {UserID} = args;

        return AppUser
            .findById(UserID)
            .then((user) => { return user })
            .catch((err) => { return err });
    }
}

module.exports = UserByID;