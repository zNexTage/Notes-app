const NoteMutation = `
    CreateNewNote(newNote:NewNote):Note
    UpdateNote(idNote:Int!, newNote:NewNote):Note
`;

module.exports = NoteMutation;