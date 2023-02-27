const router = require("express").Router();
const { connection } = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const samplePassword = "mypassword";

router.post("/login", async(req, res) => {
  const {user, password} = req.body

  try {
    let result = await connection.promise().query(
      `SELECT password FROM users WHERE username = ${user}`)
  } catch(err) {

  }
  res.status(200).send("Received credentials!")
});

module.exports = router