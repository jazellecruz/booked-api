const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DB_URL);

const connectDb = () => {
  connection.connect(err => {
    if(err) {
      process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        process.exit(1);
      });
    };
    console.log("Database connected...");
  });
};

module.exports = { connectDb, connection }
