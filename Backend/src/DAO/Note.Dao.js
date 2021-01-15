const connection = require("../Config/Database/Database");

const NoteDao = {
    insertNote(title, content) {
        return new Promise((resolve, reject) => {
            try {
                if (connection.state == "disconnected") {
                    connection.connect();
                }

                const query = "INSERT INTO tb_notes (title, content) VALUES (?)";

                const params = [title, content];

                connection.query(query, [params], (err, queryResult, fields) => {
                    if (err) {
                        reject({ error: err, queryResult });
                        return;
                    }

                    this.noteById(queryResult.insertId).then((res) => {
                        if (res.error) {
                            reject({ error: err, queryResult });
                            return;
                        }

                        resolve(res);
                    });
                });
            } catch (error) {
                throw error;
            }
            finally {
                if (connection.state == "connected") {
                    connection.end();
                }
            }
        });
    },
    noteById(idNote) {
        return new Promise((resolve, reject) => {
            try {
                if (connection.state == "disconnected") {
                    connection.connect();
                }

                const query = "SELECT * FROM tb_notes WHERE id_note = ?";

                connection.query(query, [idNote], (err, queryResult) => {
                    const note = queryResult[0];

                    console.log(note);

                    if (err) {
                        reject({ error: err, queryResult: note });
                    }

                    resolve({ queryResult: note });
                });
            }
            catch (err) {
                reject({ error: err, queryResult: {} });
            }
            finally {
                if (connection.state == "connected") {
                    connection.end();
                }
            }
        })
    }

}

module.exports = NoteDao;