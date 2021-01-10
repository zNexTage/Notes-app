const { gql } = require('apollo-server');
const NoteMutation = require('./Note.Mutation');
const UserMutation = require('./User.Mutation');

const Mutation = gql`
    type Mutation {
        ${UserMutation}
        ${NoteMutation}
    }
`;

module.exports = Mutation;