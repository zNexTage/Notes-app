const UserMutation = `
    CreateNewUser(newUser:NewUser):User
    Login(username:String!, password:String!):User
`;

module.exports = UserMutation;