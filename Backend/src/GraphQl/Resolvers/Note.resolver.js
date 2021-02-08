const NoteBll = require("../../BLL/Note.Bll");

const NoteResolver = {
    Query: {
        async NotesByUser(_, { idUser }) {
            const notesBll = new NoteBll();

            try {
                const notes = await notesBll.notesByUserId(idUser);

                console.log(notes);

                return notes;
            }
            catch (err) {
                throw err;
            }
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