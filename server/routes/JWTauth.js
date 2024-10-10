const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

//function to generate a random username
async function generateRandomUsername() {
    //one random adjective
    const adjectiveResult = await pool.query("SELECT word FROM words WHERE type = 'adjective' ORDER BY RANDOM() LIMIT 1");
    if (adjectiveResult.rows.length === 0) {
        throw new Error('No adjectives found in the database');
    }
    const adjective = adjectiveResult.rows[0].word;

    //]one random noun
    const nounResult = await pool.query("SELECT word FROM words WHERE type = 'noun' ORDER BY RANDOM() LIMIT 1");
    if (nounResult.rows.length === 0) {
        throw new Error('No nouns found in the database');
    }
    const noun = nounResult.rows[0].word;

    return adjective + noun; // combine the words to create a random username
}


//registering

router.post("/register",validInfo, async (req, res) => {
    try {
        // 1 destructure req.body (name, email, pw)
        const {email, password} = req.body;
        // 2 check if user exists, else throw error
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length !== 0){
            return res.status(401).send("User already exists.") //unauthorized
        }

        const username = await generateRandomUsername();

        // 3 becrypt user password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPw = await bcrypt.hash(password, salt);
        
        // 4 enter user inside database 
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, bcryptPw]
        );

        console.log(newUser.rows[0]);

        // generating jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token, username: newUser.rows[0].username });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//login

router.post("/login", validInfo, async(req, res) => {
    try {
        //1. destructure the req.body

        const {email, password} = req.body;

        //2. check if user doesn't exist (throw error if so)

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email
        ]);

        if (user.rows.length === 0){
            return res.status(401).json("Password or Email is incorrect");
        }

        //3. check if incoming password is the same as database password.

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword){
            return res.status(401).json("Password or Email is incorrect");
        }

        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token });

        //4. give them the jwt token
    } catch(err) {        
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

