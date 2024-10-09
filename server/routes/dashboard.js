const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


router.get('/', authorization, (req, res) => {
    try {
      res.json({ message: 'Welcome to the dashboard' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;

