const mysql = require("mysql2");

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  port     : 3300,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
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
