const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if(token) {
    try{
      let decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      next();
    } catch(err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).send("Token Expired");
      } else if (err.name === "JsonWebTokenError") {
        if(err.message === "secret or public key must be provided") {
          res.status(500).send("Error in Server")
        } else {
          res.status(401).send("Invalid Token")
        }
      } else {
        res.status(401).send("Token Denied")
      }
    }
  } else {
    res.status(401).send("No Token Received")
  }
}

module.exports = {isUserAuthenticated}