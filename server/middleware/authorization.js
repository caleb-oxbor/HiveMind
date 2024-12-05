const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = async(req, res, next) => {
    try {

        const jwtToken = req.header("token"); //init jwt token var

        if (!jwtToken) {
            return res.status(403).json("Not Authorized");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret); //confirm valid jwt token

        req.user = {
            username: payload.username, //allows user to access data if valid
            user_id: payload.user_id,
        }

        next();

    }catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
}