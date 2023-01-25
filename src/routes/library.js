const router = require("express").Router();

//homepage of user
router.get("/", (req, res) => {
  res.send("Hello from the library route!");
});

//view individual books from homepage
router.get("/:id", (req, res) => {
  res.send("This is the route for fetching a specific book.");
});

// add books
router.post("/", (req, res) => {
  res.send("Hello from the library POST route!");
});

// modify books
router.patch("/:id", (req, res) => {
  res.send("Hello from the library POST route!");
});

// delete a book
router.delete("/:id", (req, res) => {
  res.send("Hello from the library POST route!");
})


module.exports = router