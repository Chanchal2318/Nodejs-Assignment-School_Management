import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
// Here, we are creating a db connection.
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
});

//Here, we are handling error in case an error occurs.
db.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        console.log('MySQL connected');
    }
})

export default db;