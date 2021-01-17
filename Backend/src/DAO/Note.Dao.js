const database = require('../Config/Database/Database');

class NoteDao {
    insertNote(title, content) {
        return new Promise((resolve, reject) => {
            database.getConnection((err, connection) => {
                if (err) {
                    console.log("Connection error", err);

                    reject({
                        error: "Não foi possível se conectar com o banco de dados",
                        queryResult: {}
                    });

                    return;
                }

                const query = "INSERT INTO TB_NOTES (title, content) VALUES (?, ?)";

                connection.query(query, [title, content], (err, result) => {
                    connection.release();

                    if (err) {
                        console.log("Query error", err);

                        reject({
                            error: "Ocorreu um erro ao inserir a nota!",
                            queryResult: {}
                        });

                        return;
                    }

                    resolve({
                        error: {},
                        queryResult: result
                    });
                })
            })
        });
    }

    noteById(idNote) {
        return new Promise((resolve, reject) => {
            database.getConnection((err, connection) => {
                if (err) {
                    console.log("Connection error", err);

                    reject({
                        error: "Não foi possível se conectar com o banco de dados",
                        queryResult: {}
                    });

                    return;
                }

                const query = "SELECT * FROM TB_NOTES WHERE id_note = ?";

                connection.query(query, [idNote], (err, results) => {
                    if (err) {
                        reject({
                            error: "Não foi possível obter a nota",
                            queryResult: {}
                        });

                        return;
                    } 

                    resolve({ error: {}, queryResult: results[0] });
                });
            })
        })
    }

}

module.exports = NoteDao;