const NoteQuery = `
    NotesByUser(idUser:Int!):[Notes]
    GetNote(idNote:Int!):Note
`;