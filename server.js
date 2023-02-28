require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDb }= require("./src/db/db");
const auth = require("./src/routes/auth.js")
const books = require("./src/routes/books");
const categories = require("./src/routes/categories");
const reviews = require("./src/routes/reviews");

app.use(cors({
  origin: "http://localhost:3000",
  method: "GET,POST,DELETE,PATCH,OPTIONS",
}));

app.use(express.json());

// connect to database
connectDb();

//routes 
// for the main homepage of user
app.use("/library/books", books);

//the categories route
app.use("/library/categories", categories);

// the reviews route
app.use("/library/reviews", reviews);

app.get("/", (req, res) => {
  res.send("Booked main route.");
});

app.use("/auth", auth);

app.post("/test", (req, res) => {
  if (req.body) {
    console.log(req.body)
    return res.status(200).send({
      message: 'Successfully saved!'
   });
  } else {
    return res.status(400).send({
      message: 'This is an error!'
   });
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
