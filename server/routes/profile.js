const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const supabase = require("../supabaseClient");
const path = require("path");

router.get('/', authorization, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('username, email')
      .eq('user_id', req.user)
      .single();

    res.json(user);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;