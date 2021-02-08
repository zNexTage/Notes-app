const UserDao = require("../DAO/User.Dao");
const bcrypt = require('bcrypt');

class UserBll {
    async logIn(username, password) {  
        const userDao = new UserDao();

        const { error, queryResult } = await userDao.getUserByUsername(username);

        if (!error) {
            throw error; 
        }

        if (!queryResult || queryResult.length == 0) {
            throw new Error("Nome de usuário ou senha incorretos");
        }

        const user = queryResult[0];

        const match = await bcrypt.compare(password, user.password)

        if (!match) { 
            throw new Error("Nome de usuário ou senha incorretos");
        }

        return user;
    }
}


module.exports = UserBll;