
'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require("graphql");

const {AppUser, AccessToken, UserInput} = require("../types/Types.js");

var UserMutations = new GraphQLObjectType({
    name: "UserMutations",
    description: "UserMutations.",
    fields: () => ({
        token: { type: AccessToken },
        updateUser: {
            type: AppUser,
            args: { id: { type: new GraphQLNonNull(GraphQLString) }, userData: { type: UserInput } },
            resolve: function (parentValue, args, context) {
                const {AppUser} = context.app.models;
                var data = Object.assign({}, args.userData);

                return AppUser.findById(args.id)
                    .then((user) => {
                        if (user && user.id == parentValue.token.userId) {
                            return user.updateAttributes(data)
                                .then((user) => {
                                    return user;
                                })
                        }
                        else {
                            return null;
                        }
                    })
                    .catch((err) => {
                        return err;
                    });
            }
        }
    })
});

exports.UserMutations = UserMutations;