const database = require('../Config/Database/Database')
const _ = require("lodash");

class UserNoteDao {
    createRelation(userId, noteId) {
        return new Promise((resolve, reject) => {
            try {
                database.getConnection((err, connection) => {
                    if (!_.isEmpty(err)) {
                        reject({
                            error: "Não foi possível se conectar com o banco de dados",
                            queryResult: {}
                        })

                        return;
                    }

                    const query = `
                        INSERT INTO TB_USERS_NOTES (id_user, id_note)
                        VALUES(?, ?)
                    `;

                    connection.query(query, [userId, noteId], ((err, results) => {
                        connection.release();
                        connection.destroy();

                        if (!_.isEmpty(err)) {
                            reject({
                                error: "Não foi possível finalizar o cadastro da nota",
                                queryResult: {}
                            })

                            return;
                        }

                        resolve({
                            queryResult: results,
                            error: {}
                        });
                    }))
                })
            }
            catch (err) {
                reject({
                    error: err,
                    queryResult: {}
                })
            }
        })
    }
}

module.exports = UserNoteDao;