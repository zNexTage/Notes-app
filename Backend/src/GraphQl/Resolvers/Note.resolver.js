const NoteDao = require("../../DAO/Note.Dao");

const NoteResolver = {
    Query: {
        NotesByUser(_, { idUser }) {

        }
    },
    Note: {
        id(note) {
            return note.id_note;
        }
    },
    Mutation: {
        async CreateNewNote(_, { newNote }) {
            try {
                const { title, content } = newNote;

                const { error, queryResult } = await NoteDao.insertNote(title, content);

                if(error){
                    throw error;
                }

                return queryResult;
            } catch (error) {
                throw new Error("Não foi possível realizar a inserção da nota!")
            }
        }
    }
}

module.exports = NoteResolver;