const NoteDao = require("../DAO/Note.Dao");
const _ = require('lodash');
const UserNoteDao = require("../DAO/User.Note.Dao");

class NoteBll {
    async insertANote(title, content, userId, createdAt) {
        const noteDao = new NoteDao();

        const { queryResult, error } = await noteDao.insertNote(title, content, createdAt);

        if (!_.isEmpty(error)) {
            throw error;
        }

        const queryNoteById = await noteDao.noteById(queryResult.insertId);

        if (!_.isEmpty(queryNoteById.error)) {
            throw queryNoteById.error;
        }

        const newNote = queryNoteById.queryResult;

        new UserNoteDao().createRelation(userId, newNote.id_note);

        return newNote;
    }

    async updateNote(idNote, { title, content, createdAt, idUser }) {
        const noteDao = new NoteDao();

        await noteDao.deleteNote(idNote);

        const newNote = await this.insertANote(title, content, idUser, createdAt);

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

    async deleteNote(idNote) {
        const notesDao = new NoteDao();

        const noteByIdResult = await notesDao.noteById(idNote);

        if (!_.isEmpty(noteByIdResult.error)) {
            throw noteByIdResult.error;
        }

        const deleteNoteResult = await notesDao.deleteNote(idNote);

        if (!_.isEmpty(deleteNoteResult.error)) {
            throw deleteNoteResult.error;
        }

        return noteByIdResult.queryResult;
    }
}

module.exports = NoteBll;