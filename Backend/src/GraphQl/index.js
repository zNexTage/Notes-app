const { gql } = require('apollo-server');
const Schemas = require('./Schemas');
const Query = require('./Querys');
const Mutation = require('./Mutation')

const typeDefs = gql`
    ${Schemas}
    ${Query}
    ${Mutation}
`;

module.exports = typeDefs;

