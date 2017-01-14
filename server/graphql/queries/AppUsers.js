
'use strict';
const {
  GraphQLList
} = require("graphql");

const {AppUser} = require("../types/Types.js");

const AppUsers = {
    type: new GraphQLList(AppUser),
    resolve: function (rootValue, args, context) {
        const {AppUser} = context.app.models;

        return AppUser
        .find({include: ["ownEvents", "myUserComments", "otherUsersComments"]})
        .then((users) => {return users})
        .catch((err) => {return err});
    }
}

module.exports = AppUsers;