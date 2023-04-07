const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DB_URL);

const connectDb = () => {
  connection.connect(err => {
    if(err) throw err;
    console.log("Database connected...");
  });
};

module.exports = { connectDb, connection }
