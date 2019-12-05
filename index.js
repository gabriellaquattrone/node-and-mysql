// Creating a variable gives us access to an object.
const mysql = require("mysql");

require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "bamazon"
})

// With the connect method we are creating a channel to the database.
// We want to use the channel, but then free the channel up for someone else to use.
connection.connect(function(err){
    if(err){
        throw err;
    }
    console.log("Connected as ID:", connection.threadId);

    // We want to do some stuff before closing this connection.
    connection.end();

});