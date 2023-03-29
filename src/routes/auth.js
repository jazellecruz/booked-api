const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connection } = require("../db/db");
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
        let accessToken = generateAccessToken({username: username})
        let refreshToken = generateRefreshToken({username: username})
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

router.post("/verify", (req, res) => {
  let token = req.headers["x-access-token"]

  if(!token) {
    res.status(401).send("No token sent")
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, response) => {
      if(response) {
        res.status(200).send("Token Verified");
      } else if (err.name === "JsonWebTokenError") {
        console.log(err);
        res.status(500).send("Error in server")
      } else {
        console.log(err)
        res.status(401).send("Token Denied")
      }
    });
  }

});

module.exports = router