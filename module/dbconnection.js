import mysql2 from "mysql2";


// create connection
const connection = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"crud"
});


connection.connect((err) => {
    if (err){
        console.log(`the database connection is failed due to ${err.name}`);   
        return 
    }
    console.log("the database is connected successfully");   
});


export default connection;