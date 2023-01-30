const router = require("express").Router();
const { addReview,
        modifyReview,
        deleteReview } = require("../controllers/reviews");

router.post("/", async(req, res) => {
  let response = await addReview(req.body);
  res.send(response)
});

router.patch("/:review_id", async(req, res) => {
  let response = await modifyReview(req.params.review_id, req.body);
  res.send(response)
});

module.exports = router