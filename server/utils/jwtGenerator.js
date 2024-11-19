const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, username) {
  const payload = {
    user_id,
    username,
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "24h" });
}

module.exports = jwtGenerator;