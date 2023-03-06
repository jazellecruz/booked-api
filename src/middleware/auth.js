const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if(token) {
    try{
      let decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      next();
    } catch(err) {
      res.send(err);
    }
  
  } else {
    res.status(401).send("Access Denied");
  }
}

module.exports = {isUserAuthenticated}