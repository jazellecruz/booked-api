const mysql = require("mysql2");

const connection = mysql.createConnection({
  host     : '3.215.97.46',
  port     : 3300,
  user     : 'root',
  password : '@adminDeveloper',
  database : 'booked_db',
  multipleStatements: true
});

const connectDb = () => {
  connection.connect(err => {
    if(err) throw err;
    console.log("Database connected...");
  });
};

module.exports = { connectDb, connection }
