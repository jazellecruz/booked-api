require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDb }= require("./src/db/db");
const library = require("./src/routes/library");

app.use(cors({
  origin: "http://localhost:3000",
  method: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"]
}));

// connect to database
connectDb();

//routes 
app.use("/library", library);

app.get("/", (req, res) => {
  res.send("Booked main route.");
});

app.listen(8000, (req, res) => {
  console.log("Howdy from port 8000!");
});

/*
Queries to remember:
 CURDATE() - insert current date only 
*/