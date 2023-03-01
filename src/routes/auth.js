const router = require("express").Router();
const { connection } = require("../db/db");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/utils")

router.post("/login", async(req, res) => {
  const {username, password} = req.body;

  try{
    let results = await connection.promise().query(
      `SELECT password FROM users WHERE username = "${username}";`
    )

    if(results[0].length === 0){
      res.status(404).send("No user with such credentials found.")
    } else {
      let match = await bcrypt.compare(password, results[0][0].password)
      if(match) {
        let accessToken = await generateAccessToken({username: username, email: email})
        let refreshToken = await generateRefreshToken({username: username, email: email})
        res.status(200).send({
          username: username,
          accessToken: accessToken,
          refreshToken: refreshToken})
      } else {
        res.status(401).send("Access denied.")
      }
    }

  } catch(err) {
    console.log(err)
  }

});

module.exports = router