const dedent = require('dedent-js');
const communication = require('./Database')

const TbUser = dedent(`CREATE TABLE IF NOT EXISTS TB_USERS (
    id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    picture TEXT);
`);

const TbNotes = dedent(`CREATE TABLE IF NOT EXISTS TB_NOTES (
    id_note INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
)`);


const createUserTable = () => {
    return new Promise((resolve, reject) => {
        communication.query(TbUser, (err, queryResult) => {
            if (err) {
                console.error("Error onCreateUserTable", err);

                reject(err);
            }

            console.log("Users table created!", queryResult);
            resolve(queryResult);
        })
    })
};

const createNotesTables = () => {
    return new Promise((resolve, reject) => {
        communication.query(TbNotes, (err, queryResult) => {
            if (err) {
                console.error("Error onCreateNotesTable", err);

                reject(err);
            }

            console.log("Notes table created!", queryResult);
            resolve(queryResult);
        })
    })
}

const CreateTables = () => {
    communication.connect();

    Promise.all([createUserTable(),
    createNotesTables()])
        .finally(() => {
            communication.end();
        })
}

CreateTables();