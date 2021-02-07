const NoteDao = require("../src/DAO/Note.Dao");
const _ = require('lodash');

class NoteBll {
    async insertANote(title, content) {
        const noteDao = new NoteDao();

        const { queryResult, error } = await noteDao.insertNote(title, content);

        if (!_.isEmpty(error)) {
            throw error;
        }

        const queryNoteById = await noteDao.noteById(queryResult.insertId);

        if (!_.isEmpty(queryNoteById.error)) {
            throw queryNoteById.error;
        }

        const newNote = queryNoteById.queryResult;

        return newNote;
    }

    async notesByUserId(userId) {
        const notesDao = new NoteDao();

        const { queryResult, error } = await notesDao.notesByUser(userId);

        if (!_.isEmpty(error)) {
            throw error;
        }


        return queryResult;
    }
}

module.exports = NoteBll;