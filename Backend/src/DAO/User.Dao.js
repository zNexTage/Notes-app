const database = require('../Config/Database/Database')

class UserDao {
    getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            try {
                const query = "SELECT * FROM TB_USERS WHERE username = ?";

                database.getConnection((err, connection) => {
                    if (err) {
                        console.log("Connection error", err);

                        reject({
                            error: "Não foi possível se conectar com o banco de dados",
                            queryResult: {}
                        });

                        return;
                    }

                    connection.query(query, [username], (err, result) => {
                        connection.release();

                        if (err) {
                            console.log("Query error", err);

                            reject({
                                error: "Ocorreu um erro ao obter os dados do usuário!",
                                queryResult: {}
                            });

                            return;
                        }

                        console.log(result);

                        resolve({
                            error: {},
                            queryResult: result
                        });
                    })
                })
            }
            catch (err) {
                reject({
                    error: err,
                    queryResult: {}
                })
            }
        });
    }
}

module.exports = UserDao;