const NoteDao = require("../src/DAO/Note.Dao");

class NoteBll {
    async insertANote(title, content) {
        const noteDao = new NoteDao();

        const { queryResult, error } = await noteDao.insertNote(title, content);

        if (!error) {
            throw error;
        } 

        const queryNoteById = await noteDao.noteById(queryResult.insertId);

        if(!queryNoteById.error){
            throw queryNoteById.error;
        }

        const newNote = queryNoteById.queryResult;

        return newNote;
    }
}

module.exports = NoteBll;