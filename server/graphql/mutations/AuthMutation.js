
'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require("graphql");

const {AuthMutations} = require("./AuthMutations.js");

const AuthMutation = {
    type: AuthMutations,
    resolve: function () {
        return {};
    }
}

module.exports = AuthMutation;