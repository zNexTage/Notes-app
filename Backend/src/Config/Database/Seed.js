const bcrypt = require('bcrypt');
const database = require('./Database');
const saltRounds = 10;

const Users = [
    {
        name: 'Majiko',
        lastname: "Okija",
        username: "majakoja",
        password: "123",
        picture: "https://lastfm.freetls.fastly.net/i/u/770x0/5b54d5ecc1c2e5d24dd1f391a158358c.jpg"
    },
    {
        name: 'Ayanami',
        lastname: "Rei",
        username: "rei",
        password: "123",
        picture: "https://i.pinimg.com/564x/22/63/a6/2263a6111b966901ce36212a4a169903.jpg"
    },
    {
        name: 'Fujiwara',
        lastname: "Takumi",
        username: "takumi",
        password: "123",
        picture: "https://static.wikia.nocookie.net/initiald/images/3/35/Unamed.jpg/revision/latest/top-crop/width/220/height/220?cb=20200411180751"
    }
];

const getUsers = () => {
    const usersWithHashPass = Users.map((user) => {
        const salt = bcrypt.genSaltSync(saltRounds);

        const hash = bcrypt.hashSync(user.password, salt);

        return [user.name, user.lastname, user.username, hash, user.picture];
    });

    return usersWithHashPass;
}

const run = () => {
    const usersWithHashPass = getUsers();

    try{
        database.getConnection((err, connection)=>{
            let query = 'INSERT INTO TB_USERS (name, lastname, username, password, picture) VALUES ?';

            connection.query(query, [usersWithHashPass], (err, result)=>{
                connection.release();
                connection.destroy();
                
                if(err){
                    console.log(err);
                    return;
                }
    
                console.log(result);
            });
        });   
        
        
    }
    catch(err){
        console.log(err);
    }
}

run();