const dedent = require('dedent-js');
const communication = require('./Database')

const TbUser = dedent(`CREATE TABLE IF NOT EXISTS TB_USERS (
    id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    picture TEXT);
`);

const TbNotes = dedent(`CREATE TABLE IF NOT EXISTS TB_NOTES (
    id_note INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
);
`);

const TbUserNotes = dedent(`
    CREATE TABLE IF NOT EXISTS TB_USERS_NOTES(
        id_user_note INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        id_user INT,
        id_note INT,
        CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES TB_USERS (id_user),
        CONSTRAINT fk_note FOREIGN KEY (id_note) REFERENCES TB_NOTES (id_note)
    );
`);

const createUserTable = () => {
    return new Promise((resolve, reject) => {
        communication.query(TbUser, (err, queryResult) => {
            if (err) {
                console.error("Error onCreateUserTable", err);

                reject(err);

                return;
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

                return;
            }

            console.log("Notes table created!", queryResult);
            resolve(queryResult);
        })
    })
}

const createUserNotes = ()=>{
    return new Promise((resolve, reject) => {
        communication.query(TbUserNotes, (err, queryResult) => {
            if (err) {
                console.error("Error onCreateUsersNotesTable", err);

                reject(err);

                return;
            }

            console.log("Users/Notes table created!", queryResult);
            resolve(queryResult);
        })
    })
}

const CreateTables = () => {
    communication.connect();

    Promise.all([
        createUserTable(),
        createNotesTables(),
        createUserNotes()
    ])
        .finally(() => {
            communication.end();
        })
}

CreateTables();