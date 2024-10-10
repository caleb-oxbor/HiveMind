const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");

//function to generate a random username
async function generateRandomUsername() {
    let isUnique = false;
    let username;

    while (!isUnique){
    //one random adjective
    const adjectiveResult = await pool.query("SELECT word FROM words WHERE type = 'adjective' ORDER BY RANDOM() LIMIT 1");
    if (adjectiveResult.rows.length === 0) {
        throw new Error('No adjectives found in the database');
    }
    const adjective = adjectiveResult.rows[0].word;

    //one random noun
    const nounResult = await pool.query("SELECT word FROM words WHERE type = 'noun' ORDER BY RANDOM() LIMIT 1");
    if (nounResult.rows.length === 0) {
        throw new Error('No nouns found in the database');
    }
    const noun = nounResult.rows[0].word;

    username = adjective + noun; // combine the words to create a random username

    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
        isUnique = true;
    } else {
        // If username exists, append a random number (e.g., between 100 and 999)
        const randomNumber = Math.floor(Math.random() * 900) + 100; // Generates a number between 100 and 999
        username = username + randomNumber;
        // Re-check with the new username
        const finalCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (finalCheck.rows.length === 0) {
            isUnique = true;
        }
    }

    }   
    return username;
}


//registering

router.post("/register",validInfo, async (req, res) => {
    // 1 destructure req.body (name, email, pw)
    const {email, password} = req.body;
    try {
        // 2 check if user exists, else throw error
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length > 0){
            return res.status(401).json("User already exists.") //unauthorized
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

        // generating jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token, username: newUser.rows[0].username });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//login

module.exports = router;

