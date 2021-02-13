import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from "@apollo/client/link/http";

const link = createHttpLink({ uri: "https://chr-notes-application-backend.herokuapp.com/" });


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
