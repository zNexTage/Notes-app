const Note = `
    type Note {
        id:Int
        title:String
        content:String
        createdAt:Date
        user:User
    }

    input NewNote {
        title:String!
        content:String!
        idUser:Int!
    }
`;

module.exports = Note;