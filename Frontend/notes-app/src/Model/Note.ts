import User from "./User";

class Note {
    id:number
    title:string
    content:string
    createdAt:Date
    user:User;

    constructor(title:string, content:string){
        this.title = title;
        this.content = content;
    }    
}

export default Note;