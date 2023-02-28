const jwt = require("jsonwebtoken");

const generateAccessToken = ({username, email}) => {
  const user = {
    username: username,
    email: email
  }

  let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2d' });
  
  return accessToken
}

const generateRefreshToken = ({username, email}) => {
  const user = {
    username: username,
    email: email
  }

  let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

  return refreshToken
}


module.exports = { generateAccessToken, generateRefreshToken }