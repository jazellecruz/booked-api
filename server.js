require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDb }= require("./src/db/db");
const auth = require("./src/routes/auth.js")
const books = require("./src/routes/books");
const categories = require("./src/routes/categories");
const reviews = require("./src/routes/reviews");
const { isUserAuthenticated } = require("./src/middleware/auth")

app.use(cors({
  origin: "http://localhost:3000",
  method: "GET,POST,DELETE,PATCH,OPTIONS",
}));

app.use(express.json());

// connect to database
connectDb();

//routes 
// for the main homepage of user
app.use("/library/books", isUserAuthenticated, books);

//the categories route
app.use("/library/categories",isUserAuthenticated, categories);

// the reviews route
app.use("/library/reviews",isUserAuthenticated, reviews);

app.get("/", (req, res) => {
  res.send("Booked main route.");
});

app.use("/auth", auth);

app.post("/test", (req, res) => {
  if (req.body) {
    console.log(req.body)
    res.status(200).send('Successfully saved!');
  } else {
    res.status(500).send('Internal Server Error');
  }
})

app.delete("/test/:book_id", (req, res) => {
  if(req.params.book_id) {
    console.log(req.params.book_id)
    return res.status(200).send({
      message: 'Successfully deleted!'
    });
  } else {
    return res.status(400).send({
      message: 'No item deleted.'
   })
  }
})

app.listen(8000, () => {
  console.log("Howdy from port 8000!");
});
