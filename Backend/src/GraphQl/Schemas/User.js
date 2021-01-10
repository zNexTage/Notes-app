const User = `
    type User {
        id:Int
        name:String
        lastname:String
        username:String
        password:String
        createdAt:Date
        updatedAt:Date
        picture:String
    }

    input NewUser {
        name:String!
        lastname:String!
        username:String!
        password:String!
    }
`;

module.exports = User;