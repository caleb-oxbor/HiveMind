const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

//registering

router.post("/register", async (req, res) => {
    try {
        // 1 destructure req.body (name, email, pw)
        const {name, email, password} = req.body;
        // 2 check if user exists, else throw error
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length !== 0){
            return res.status(401).send("User already exists.") //unauthorized
        }
        
        res.json(user.rows)

        // 3 becrypt user password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPw = await bcrypt.hash(password, salt);
        // 4 enter user inside database 
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPw]
        );

        //res.json(newUser.rows[0]);

        // generating jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//login route

module.exports = router;

