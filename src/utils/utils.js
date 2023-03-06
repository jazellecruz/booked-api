const jwt = require("jsonwebtoken");

const generateAccessToken = ({username}) => {
  const user = {
    username: username
  }

  let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
  
  return accessToken
}

const generateRefreshToken = ({username}) => {
  const user = {
    username: username
  }

  let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

  return refreshToken
}


module.exports = { generateAccessToken, generateRefreshToken }