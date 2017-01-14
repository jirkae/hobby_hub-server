
'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require("graphql");

const {RegistrationInput, AccessToken, AppUser} = require("../types/Types.js");

var AuthMutations = new GraphQLObjectType({
    name: "AuthMutations",
    description: "AuthMutations.",
    fields: {
        register: {
            type: AppUser,
            args: { userData: { type: RegistrationInput } },
            resolve: function (parentValue, args, context) {

                const {AppUser} = context.app.models;
                var data = Object.assign({}, args.userData);

                return AppUser.create(data)
                    .then((user) => {
                        return user;
                    })
                    .catch((err) => {
                        return err
                    });
            }
        },
        login: {
            type: AccessToken,
            args: { email: { type: new GraphQLNonNull(GraphQLString) }, password: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: function (parentValue, args, context) {
                const {AppUser} = context.app.models;
                var data = { email: args.email, password: args.password };
                return AppUser.login(data)
                    .then((token) => {
                        return token;
                    })
                    .catch((err) => {
                        return err
                    });
            }
        },
        logout: {
            type: GraphQLString,
            args: { token: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: function (parentValue, args, context) {
                const {AppUser} = context.app.models;
                return AppUser.logout(args.token)
                    .then((result) => {
                        return result;
                    })
                    .catch((err) => {
                        return err
                    });
            }
        }
    }
});

exports.AuthMutations = AuthMutations;