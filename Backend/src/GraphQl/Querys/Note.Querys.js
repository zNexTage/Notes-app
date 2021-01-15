const NotesQuery = `
    NotesByUser(idUser:Int!):[Note]
    GetNote(idNote:Int!):Note
`;

module.exports = NotesQuery;