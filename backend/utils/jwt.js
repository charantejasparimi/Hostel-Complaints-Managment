// Generate token
const jwt = require("jsonwebtoken");
const gentoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = gentoken;
