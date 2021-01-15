const { gql } = require('apollo-server');
const UserQuerys = require('./User.Querys');
const NotesQuerys = require('./Note.Querys')

const Query = gql`
    scalar Date
    type Query {
        ${UserQuerys},
        ${NotesQuerys}
    }
`;

module.exports = Query;