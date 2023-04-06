const jwt = require("jsonwebtoken");

const isUserAuthenticated = async(req, res, next) => {
  let token = req.headers["x-access-token"]

  if(token) {
    try{
      let decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      next();
    } catch(err) {
      if(err.name === "JsonWebTokenError") {
        if(err.message === "secret or public key must be provided"){
          res.status(500).send("Failed Verification. Error in Server.")
        } else {
          res.status(401).send("Invalid Token");
        }
      } else {
        res.status(401).send("Token Denied");
      }
    }

  } else {
    res.status(401).send("No Token Received");
  }
}

module.exports = {isUserAuthenticated}