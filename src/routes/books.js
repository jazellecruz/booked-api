const router = require("express").Router();
const { getBooks, 
        addBook,
        deleteBook, 
        modifyBook } = require("../controllers/books");

// route for getting books
router.get("/", async(req, res) => {
  let response = await getBooks();
  res.send(response);
});

// get a book by its id
router.get("/id", async(req, res) => {

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