'use strict';
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const {AppUser} = require("../types/Types.js");

const CurrentUser = {
    type: AppUser,
    resolve: function (rootValue, args, context) {
        const {AppUser} = context.app.models;
        const {UserID} = args;

        //TOKEEEEEEEEEEEEN


        return AppUser
            .getCurrentUser()
            .then((user) => { return user })
            .catch((err) => { return err });
    }
}

module.exports = CurrentUser;