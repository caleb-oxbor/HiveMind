const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = async(req, res, next) => {
    try {

        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json("Not Authorized");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = {
            username: payload.username,
            user_id: payload.user_id,
        }

        // console.log(req.user);
        // console.log("Payload content:", JSON.stringify(payload, null, 2));

        next();

    }catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
}