const { gql } = require('apollo-server');
const UserQuerys = require('./User.Querys');

const Query = gql`
    scalar Date
    type Query {
        ${UserQuerys}
    }
`;

module.exports = Query;