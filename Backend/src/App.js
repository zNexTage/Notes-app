const {ApolloServer} = require('apollo-server');
const typeDefs = require('./GraphQl')
const resolvers = require('./GraphQl/Resolvers');
    
const server = new ApolloServer({ typeDefs, resolvers });
    
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

 

