
'use strict';
const {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
} = require("graphql");

const {AppUser, AccessToken, UserInput, UserComment} = require("../types/Types.js");

var UserMutations = new GraphQLObjectType({
    name: "UserMutations",
    description: "UserMutations.",
    fields: () => ({
        token: { type: AccessToken },
        updateUser: {
            type: AppUser,
            args: { userData: { type: UserInput } },
            resolve: function (parentValue, args, context) {
                const {AppUser} = context.app.models;
                var data = Object.assign({}, args.userData);

                return AppUser.findById(parentValue.token.userId)
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
        },
        newUserComment: {
            type: UserComment,
            args: { targetUserId: { type: GraphQLString }, text: { type: GraphQLString }, rating: { type: GraphQLInt } },
            resolve: function (parentValue, args, context) {
                var data = {
                    text: args.text,
                    dateCreated: new Date(),
                    commenterId: parentValue.token.userId,
                    targetUserId: args.targetUserId,
                    rating: args.rating
                }
                const {UserComment} = context.app.models;
                //pridat overeni ze event existuje a ze muze user komentovat
                return UserComment.create(data)
                    .then((comment) => {
                        return comment;
                    })
                    .catch((err) => {
                        return err;
                    });
            }
        }
    })
});

exports.UserMutations = UserMutations;