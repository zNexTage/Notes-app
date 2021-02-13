const {ApolloServer} = require('apollo-server');
const typeDefs = require('./GraphQl')
const resolvers = require('./GraphQl/Resolvers');
    
const server = new ApolloServer({ typeDefs, resolvers, cors: {
    origin: '*',			// <- allow request from all domains
    credentials: true}
});
    
server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

 

