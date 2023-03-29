const router = require("express").Router();
const {getStatus} = require("../controllers/status")

router.get("/", (req, res) => {
  getStatus(res);
}); 

module.exports = router