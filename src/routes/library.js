const router = require("express").Router();
const { getCategories } = require("../controllers/books");

// route for getting books
router.get("/", async(req, res) => {
  let response = await getCategories();
  res.send(response);
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
  res.send("Hello from the library PATCH route!");
});

// delete a book
router.delete("/:id", (req, res) => {
  res.send("Hello from the library DELETE route!");
})


module.exports = router