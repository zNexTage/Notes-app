const users = [
    {
        id: 1,
        name:"Majiko",
        lastname:"Majakoja"
    },
    {
        id:2,
        name:"Ayanami",
        lastname:'Rei'
    },
    {
        id:3,
        name:"Asuka",
        lastname:"Langley"
    }
];

const UserResolver = {
    Query:{
        AllUsers:()=>{
            return users;
        },
        GetUser:(_, {id})=>{
            const user = users.filter((u)=> u.id == id);

            return user;
        }
    }
}

module.exports = UserResolver;