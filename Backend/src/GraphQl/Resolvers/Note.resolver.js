const NoteBll = require("../../../BLL/Note.Bll"); 

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

                const noteBll = new NoteBll();

                const note = await noteBll.insertANote(title, content); 

                return note;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = NoteResolver;