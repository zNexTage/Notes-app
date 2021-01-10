const User = require("../Schemas/User");

const UserQuery = `
    AllUsers:[User]
    GetUser(id:Int!):User
`;

module.exports = UserQuery;