const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const multer = require('multer');

router.get('/', authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT username FROM users WHERE user_id = $1",
      [req.user]
    );
    res.json(user.rows[0]);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const upload = multer();

router.post('/create-post', [authorization, upload.single('newPost')], async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    const userId = req.user;

    if (!file || !title) {
        return res.status(400).json({ error: "Missing title or file" });
    }

    console.log(`Received title: ${title}`);
    console.log(`Received file: ${file.originalname}`);
    console.log(`Received user: ${userId}`);

    const fileType = file.mimetype.split('/')[1];

    if (!['pdf', 'jpeg', 'png'].includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Insert the new post into the 'posts' table
    const newPost = await pool.query(
        "INSERT INTO posts (post_title, post_content, post_type, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, file.buffer, fileType, userId]
    );

    res.status(201).json({
        message: "Post created successfully!",
        post: newPost.rows[0],
    });
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

router.get("/is-posted", authorization, async (req, res) => {
  try {
    const post = await pool.query(
      "SELECT post_id FROM posts WHERE user_id = $1",
      [req.user]
    );
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;