const router = require("express").Router();
const { getCategories,
        getBooksByCategory,
        addCategory } = require("../controllers/categories");

// get  list of categories 
router.get("/", async(req, res) => {
  let response = await getCategories();
  res.send(response);
});
// get books by category
router.get("/:id", async(req, res) => {
  let response = await getBooksByCategory(req.params.id);
  res.send(response);
});

// add a custom category
router.post("/", async(req, res) => {
  let response = await addCategory(req.body.category);
  res.send(response);
})

module.exports = router