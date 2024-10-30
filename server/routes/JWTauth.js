const router = require("express").Router();
//const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");
const supabase = require("../supabaseClient");

//function to generate a random username
async function generateRandomUsername() {
    let isUnique = false;
    let username;

    while (!isUnique) {
        const adjectiveResult = await supabase
            .from('words')
            .select('word')
            .eq('type', 'adjective')
            .order('random')
            .limit(1);

        const nounResult = await supabase
            .from('words')
            .select('word')
            .eq('type', 'noun')
            .order('random')
            .limit(1);

        const adjective = adjectiveResult.data[0]?.word;
        const noun = nounResult.data[0]?.word;

        if (!adjective || !noun) {
            throw new Error('No words found in the database');
        }

        username = adjective + noun;

        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (!existingUser) {
            isUnique = true;
        } else {
            const randomNumber = Math.floor(Math.random() * 900) + 100;
            username = username + randomNumber;

            const { data: finalCheck } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (!finalCheck) {
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
        //const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

            if (userError && userError.code !== 'PGRST105') {
                // Handles any other Supabase error
                throw userError;
            }

            if (existingUser) {
                return res.status(401).json("User already exists.");
            }
        
        if (user.rows.length > 0){
            return res.status(401).json("User already exists.") //unauthorized
        }

        const username = await generateRandomUsername();

        // 3 becrypt user password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPw = await bcrypt.hash(password, salt);
        
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{username, password: bcryptPw, email}])
            .single();

        if (insertError) throw insertError;


        // 4 enter user inside database 
        // const newUser = await pool.query(
        //     "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        //     [username, email, bcryptPw]
        // );

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

        // const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        //     email
        // ]);

        const user = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

            if (error || !user) {
                return res.status(401).json("Password or Email is incorrect");
            }

        //3. check if incoming password is the same as database password.

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }

        const token = jwtGenerator(user.id); // Use the correct field for user ID
        res.json({ token });
    } catch (err) {
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

