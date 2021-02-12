const NoteMutation = `
    CreateNewNote(newNote:NewNote):Note
    UpdateNote(idNote:Int!, newNote:NewNote):Note
    DeleteNote(idNote:Int!):Note
`;

module.exports = NoteMutation;