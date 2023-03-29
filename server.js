require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDb }= require("./src/db/db");
const auth = require("./src/routes/auth.js")
const books = require("./src/routes/books");
const categories = require("./src/routes/categories");
const reviews = require("./src/routes/reviews");
const status = require("./src/routes/status");
const { isUserAuthenticated } = require("./src/middleware/auth")

app.use(cors({
  origin: "http://localhost:3000",
  method: "GET,POST,DELETE,PATCH,OPTIONS",
}));

app.use(express.json());

// connect to database
connectDb();

//routes 

app.get("/", (req, res) => {
  res.send("Booked main route.");
});

// for getting books
app.use("/library/books", isUserAuthenticated, books);

//the categories route
app.use("/library/categories",isUserAuthenticated, categories);

// the reviews route
app.use("/library/reviews",isUserAuthenticated, reviews);

// status route
app.use("/library/status",isUserAuthenticated, status);

// for authentication of user
app.use("/auth", auth);

app.listen(8000, () => {
  console.log("Howdy from port 8000!");
});
