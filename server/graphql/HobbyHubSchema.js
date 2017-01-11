'use strict';
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");

//Queries
const Events = require("./queries/Events.js");
const AppUsers = require("./queries/AppUsers.js");
const EventByID = require("./queries/EventByID.js");
const EventByName = require("./queries/EventByName.js");
const EventByDesc = require("./queries/EventByDesc.js");
const UserByID = require("./queries/UserByID.js");
const CurrentUser = require("./queries/CurrentUser.js");
const DistinctTags = require("./queries/DistinctTags.js");
const Cities = require("./queries/Cities.js");

//Mutations
const EventMutation = require("./mutations/EventMutation.js");
const UserMutation = require("./mutations/UserMutation.js");
const AuthMutation = require("./mutations/AuthMutation.js");


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    events: Events,
    users: AppUsers,
    eventByID: EventByID,
    eventByName: EventByName,
    eventByDesc: EventByDesc,
    userByID: UserByID,
    currentUser: CurrentUser,
    distinctTags: DistinctTags,
    cities: Cities
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    eventMutation: EventMutation,
    userMutation: UserMutation,
    authMutation: AuthMutation
  }
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = schema;
