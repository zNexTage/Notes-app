import { gql } from "@apollo/client";
import _ from "lodash";
import client from "../Api";
import User from "../Model/User";

const LOGIN_QUERY = gql`
  query login($username:String!, $password:String!){
      Login(username:$username, password:$password){
          id
          name
          lastname
          picture
          username
          picture
          createdAt
      }
  }    
  
  `;

class UserClient {
    static async login(username: string, password: string) {
        const queryOptions = {
            query: LOGIN_QUERY,
            variables: {
                username, password
            }
        }

        return new Promise(async (resolve: (user: User) => void, reject) => {
            const apolloCache = client.readQuery(queryOptions);

            if (!_.isEmpty(apolloCache)) {

                const { Login }: { Login: User } = apolloCache;

                resolve(Login);
            }
            else {
                try {
                    const { error, data } = await client.query(queryOptions);

                    if (!_.isUndefined(error) && !_.isEmpty(error)) {
                        let body = "";

                        error.graphQLErrors.forEach((err) => {
                            body += err.message;
                        });

                        reject(body);
                    }
                    else {
                        const user = data.Login as User;

                        resolve(user);
                    }
                }
                catch(err){
                    reject("Não foi possível realizar o login! Tente mais tarde.");
                }
            }
        })
    }
}

export default UserClient;