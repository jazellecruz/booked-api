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
  origin: ["https://booked-five.vercel.app", /\.booked-five.vercel.app\.com$/,],
  method: "GET,POST,DELETE,PATCH,OPTIONS",
  allowedHeaders: "*",
  credentials: true
}));

app.use(express.json());

// connect to database
connectDb();

//routes 
app.use("/library/books", isUserAuthenticated, books);

app.use("/library/categories",isUserAuthenticated, categories);

app.use("/library/reviews",isUserAuthenticated, reviews);

app.use("/library/status",isUserAuthenticated, status);

// for authentication of user
app.use("/auth", auth);

app.get("*", (req, res) => {
  res.status(404).send("No route was found matching the url.");
});

app.listen(80, () => {
  console.log("🤠 Howdy from port 80!");
});
