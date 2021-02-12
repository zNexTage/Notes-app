import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from "@apollo/client/link/http";

const link = createHttpLink({ uri: "http://192.168.0.12:4000" });


const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            notifyOnNetworkStatusChange: true,
            errorPolicy:"all",
            fetchPolicy:"network-only"
        },
        mutate:{
            errorPolicy:'all'
        }
    }
});

export default client;