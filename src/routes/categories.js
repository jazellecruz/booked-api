const router = require("express").Router();
const { getCategories,
        addCategory } = require("../controllers/categories");

// get  list of categories 
router.get("/", (req, res) => {
  getCategories(res);
});

// add a custom category
router.post("/", (req, res) => {
  addCategory(req.body.category, res);
})

module.exports = router