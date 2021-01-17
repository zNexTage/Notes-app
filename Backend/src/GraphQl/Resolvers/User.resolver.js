const UserBll = require("../../../BLL/User.Bll");
const UserDao = require("../../DAO/User.Dao");

const UserResolver = {
    Mutation: {
        async Login(_, { username, password }) {
            try {
                const userBll = new UserBll();

                const user = await userBll.logIn(username, password); 

                return user;
            }
            catch (err) {
                throw err;
            }
        }
    },
    User: {
        id({ id_user }) {
            return id_user;
        }
    }
}

module.exports = UserResolver;