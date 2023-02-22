require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDb }= require("./src/db/db");
const books = require("./src/routes/books");
const categories = require("./src/routes/categories");
const reviews = require("./src/routes/reviews");

app.use(cors({
  origin: "http://localhost:3000",
  method: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"]
}));

app.use(express.json());

// connect to database
connectDb();

//routes 
// for the main homepage of user
app.use("/library/books", books);

//the categories route
app.use("/library/categories/", categories);

// the reviews route
app.use("/library/reviews", reviews);

app.get("/", (req, res) => {
  res.send("Booked main route.");
});

app.post("/test", (req, res) => {
  console.log(req.body)
})

app.listen(8000, () => {
  console.log("Howdy from port 8000!");
});
