const Note = `
    type Note {
        id:Int
        title:String
        content:String
        dateCriation:Date
        user:User
    }

    input NewNote {
        title:String!
        content:String!
    }
`;

module.exports = Note;