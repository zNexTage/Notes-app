const database = require('../Config/Database/Database');
const dedent = require('dedent-js');

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

    deleteNote(idNote){
        return new Promise((resolve, reject)=>{
            database.getConnection((err, connection)=>{
                if (err) {
                    console.log("Connection error", err);

                    reject({
                        error: "Não foi possível se conectar com o banco de dados",
                        queryResult: {}
                    });

                    return;
                }

                const query = dedent(`
                    UPDATE TB_NOTES 
                    SET updatedAt = ?
                    WHERE id_note = ?
                `);

                connection.query(query, [new Date(), idNote], (err, results)=>{
                    connection.release();

                    if (err) {
                        console.log("Query error", err);

                        reject({
                            error: "Ocorreu um erro ao remover a nota!",
                            queryResult: {}
                        });

                        return;
                    }

                    resolve({
                        queryResult: results,
                        error: {}
                    })
                })
            })
        })
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

    notesByUser(userId) {
        return new Promise((resolve, reject) => {
            database.getConnection((err, con) => {
                if (err) {
                    console.log("Connection error", err);

                    reject({
                        error: "Não foi possível se conectar com o banco de dados",
                        queryResult: {}
                    });

                    return;
                }

                const query = `
                    SELECT NOTES.* FROM TB_NOTES NOTES
                    INNER JOIN TB_USERS_NOTES USER_NOTE ON USER_NOTE.ID_NOTE = NOTES.ID_NOTE
                    WHERE USER_NOTE.ID_USER = ?
                `;

                con.query(query, [userId], (err, notes) => {
                    if (err) {
                        reject({
                            error: "Não foi possível obter as notas do usuário",
                            queryResult: {}
                        });

                        return;
                    }

                    console.log("resolveu aqui no DAO");

                    resolve({ error: {}, queryResult: notes });
                })
            })
        })
    }

}

module.exports = NoteDao;