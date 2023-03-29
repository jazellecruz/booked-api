const router = require("express").Router();
const { getBooks,
        filterBooks,
        addBook,
        deleteBook, 
        modifyBook } = require("../controllers/books");

// route for getting books
router.get("/", (req, res, next) => {
  if(Object.keys(req.query).length !== 0) { 
    next();
  } else {
    getBooks(res);
  }
});

//route to filter books
router.get("/", (req, res) => {
  filterBooks(req.query, res)
});

// get a book by its id
router.get("/:id", (req, res) => {

});

// add a book
router.post("/", (req, res) => {
  addBook(req.body, res);
});

// modify book by its id
router.patch("/:id", (req, res) => {
  modifyBook(req.params.id, req.body, res);
});

//delete a book by id
router.delete("/:id", (req, res) => {
  deleteBook(req.params.id, res);
});

//delete a book by query


module.exports = router

/* MULIPLE ROUTES FOR */