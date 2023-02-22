const router = require("express").Router();
const { getBooks,
        filterBooks,
        getBooksByCategory, 
        addBook,
        deleteBook, 
        modifyBook } = require("../controllers/books");

// route for getting books
router.get("/", async(req, res, next) => {
  let response;
  if(req.query) {
    next();
  } else {
  response = await getBooks();
  res.send(response)
  }
});

//route to filter books
router.get("/", async(req, res) => {
  let response = await filterBooks(req.query)
  res.send(response)
});

// get a book by its id
router.get("/:id", async(req, res) => {

});

// filter books by category
router.get("/", async(req, res) => {
  let response = await getBooksByCategory(req.query["category_id"]);
  res.send(response);
});

// add a book
router.post("/", async(req, res) => {
  let response = await addBook(req.body);
  res.send(response);
});

// modify book by its id
router.patch("/:id", async(req, res) => {
  let response = await modifyBook(req.params.id, req.body);
  res.send(response);
});

//delete a book by id
router.delete("/:id", async(req, res) => {
  let response = await deleteBook(req.params.id );
  res.send(response);
});

//delete a book by query


module.exports = router

/* MULIPLE ROUTES FOR */