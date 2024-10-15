const rounter = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post('/', authorization, (req, res) => {
  try {
    const user = await.pool.query(
      "SELECT username FROM users WHERE user_id = $1",
      [req.user.id]
    );
    res.json(user.rows[0]);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;