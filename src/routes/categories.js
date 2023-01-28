const router = require("express").Router();
const { getBooksByCategory,
        addCategory } = require("../controllers/categories");

// get books by category
router.get("/:id", async(req, res) => {
  let response = await getBooksByCategory(req.params.id);
  res.send(response);
});

// add a custom category
router.post("/", async(req, res) => {
  let response = await addCategory(req.body);
  res.send(response);
})

module.exports = router