const UserResolver = require('./User.resolver');
const NoteResolver = require('./Note.resolver');

const Resolvers = [
    UserResolver,
    NoteResolver
];

module.exports = Resolvers;