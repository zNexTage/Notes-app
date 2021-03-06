const NoteBll = require("../../BLL/Note.Bll");

const NoteResolver = {
    Query: {
        async NotesByUser(_, { idUser }) {
            const notesBll = new NoteBll();

            try {
                const notes = await notesBll.notesByUserId(idUser);

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
                const { title, content, idUser } = newNote;

                const noteBll = new NoteBll();

                const note = await noteBll.insertANote(title, content, idUser);

                return note;
            } catch (error) {
                throw error;
            }
        },
        async UpdateNote(_, { idNote, newNote }) {
            try {
                const note = await new NoteBll().updateNote(idNote, newNote)

                return note;
            }
            catch(err){
                throw err;
            }
        },
        async DeleteNote(_, { idNote }) {
            try {
                const note = await new NoteBll().deleteNote(idNote);

                return note;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = NoteResolver;