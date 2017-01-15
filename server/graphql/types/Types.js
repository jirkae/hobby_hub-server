'use strict';
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLBoolean
} = require("graphql");


//  --- POZNAMKA ---
//  Typy jsou v jednom souboru, protoze se mi nepodarilo
//  vyresit "circular dependency" jednotlivych typu.
//  AppUser ma v konstruktoru dependency na Event
//  a Event ma v konstruktoru dependency na AppUser
//  Proto je taky fields u kazdyho typu closure
//  napr. fields: () => ({ ... 
//  = lazy loading


module.exports = exports = {};

var AppUser = new GraphQLObjectType({
    name: "AppUser",
    description: "This represents the user.",
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        info: { type: GraphQLString },
        ownEvents: {
            type: new GraphQLList(Event),
            resolve: function (parent, args, context) {
                return parent.ownEvents();
            }
        },
        eventsParticipationConfirmed: {
            type: new GraphQLList(Event),
            resolve: function (parent, args, context) {
                const {Participation} = context.app.models;
                const participantId = parent.id;
                return Participation
                    .find({
                        where: { and: [{ participantId: participantId }, { state: "confirmed" }] },
                        include: "event"
                    })
                    .then((participations) => {
                        var events = participations.map((participation) => {
                            return participation.event();
                        })
                        return events;
                    })
            }
        },

        eventsParticipationRequested: {
            type: new GraphQLList(Event),
            resolve: function (parent, args, context) {
                const {Participation} = context.app.models;
                const participantId = parent.id;
                return Participation
                    .find({
                        where: { and: [{ participantId: participantId }, { state: "pending" }] },
                        include: "event"
                    })
                    .then((participations) => {
                        var events = participations.map((participation) => {
                            return participation.event();
                        })
                        return events;
                    })
            }
        },
        myUserComments: {
            type: new GraphQLList(UserComment),
            resolve: function (parent, args, context) {
                return parent.myUserComments();
            }
        },
        otherUsersComments: {
            type: new GraphQLList(UserComment),
            resolve: function (parent, args, context) {
                return parent.otherUsersComments({include: "commenter"});
            }
        }
    })
});

var Event = new GraphQLObjectType({
    name: "Event",
    description: "This represents the event.",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        detailedDescription: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        participantsMin: { type: GraphQLInt },
        participantsMax: { type: GraphQLInt },
        participantsConfirm: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        zipCode: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        dateUpdated: { type: GraphQLString },
        price: { type: GraphQLInt },
        ownerId: { type: GraphQLID },
        owner: {
            type: AppUser,
            resolve: function (parent, args, context) {
                return parent.owner();
            }
        },
        participantsConfirmed: {
            type: new GraphQLList(AppUser),
            resolve: function (parent, args, context) {
                const {Participation} = context.app.models;
                const eventId = parent.id;
                return Participation
                    .find({
                        where: { and: [{ eventId: eventId }, { state: "confirmed" }] },
                        include: "participant"
                    })
                    .then((participations) => {
                        var participants = participations.map((participation) => {
                            return participation.participant();
                        })
                        return participants;
                    })
            }
        },
        participantsRequested: {
            type: new GraphQLList(AppUser),
            resolve: function (parent, args, context) {
                const {Participation} = context.app.models;
                const eventId = parent.id;
                return Participation
                    .find({
                        where: { and: [{ eventId: eventId }, { state: "pending" }] },
                        include: "participant"
                    })
                    .then((participations) => {
                        var participants = participations.map((participation) => {
                            return participation.participant();
                        })
                        return participants;
                    })
            }
        },
        comments: {
            type: new GraphQLList(EventComment),
            resolve: function (parent, args, context) {
                return parent.eventComments({ include: "appUser" });
            }
        }
    })
});

exports.AppUser = AppUser;
exports.Event = Event;

var Tag = new GraphQLObjectType({
    name: "Tag",
    description: "This represents the tags.",
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) }
    })
});

exports.Tag = Tag;

var AccessToken = new GraphQLObjectType({
    name: "AccessToken",
    description: "This represents the AccessToken.",
    fields: () => ({
        id: { type: GraphQLString },
        userId: { type: GraphQLString }
    })
});

exports.AccessToken = AccessToken;

var EventInput = new GraphQLInputObjectType({
    name: "EventInput",
    description: "This represents the event input.",
    fields: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        detailedDescription: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        participantsMin: { type: GraphQLInt },
        participantsMax: { type: GraphQLInt },
        participantsConfirm: { type: GraphQLBoolean },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        zipCode: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        price: { type: GraphQLInt }
    }
});


exports.EventInput = EventInput;

var UserInput = new GraphQLInputObjectType({
    name: "UserInput",
    description: "This represents the User input.",
    fields: {
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        info: { type: GraphQLString }
    }
});

exports.UserInput = UserInput;

var RegistrationInput = new GraphQLInputObjectType({
    name: "RegistrationInput",
    description: "This represents the registration input.",
    fields: {
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        password: { type: GraphQLString }
    }
});

exports.RegistrationInput = RegistrationInput;

var EventComment = new GraphQLObjectType({
    name: "EventComment",
    description: "This represents the event comment.",
    fields: {
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        user: {
            type: AppUser,
            resolve: function (parent, args, context) {
                return parent.appUser();
            }
        }
    }
});

exports.EventComment = EventComment;

var UserComment = new GraphQLObjectType({
    name: "UserComment",
    description: "This represents the user comment.",
    fields: {
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        rating: { type: GraphQLInt },
        user: {
            type: AppUser,
            resolve: function (parent, args, context) {
                return parent.commenter();
            }
        }
    }
});

exports.UserComment = UserComment;