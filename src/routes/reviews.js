const router = require("express").Router();
const { addReview,
        modifyReview,
        deleteReview } = require("../controllers/reviews");

router.post("/", (req, res) => {
  addReview(req.body, res);
});

router.patch("/:review_id", async(req, res) => {
  modifyReview(req.params.review_id, req.body, res);
});

router.delete("/:review_id", (req, res) => {
  deleteReview(req.params.review_id, res);
});


module.exports = router