const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const multer = require('multer');
const path = require("path");
const express = require("express");
const supabase = require("../supabaseClient");

router.get('/', authorization, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('user_id', req.user)
      .single();
    
    //console.log(req.user)
    //console.log(user);
    res.json(user);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in 'uploads/' directory
  },
  filename: (req, file, cb) => {
      const uniqueName = Date.now() + path.extname(file.originalname);
      cb(null, uniqueName);
  },
});

const upload = multer({ storage }); 

router.post('/create-post', [authorization, upload.single('newPost')], async (req, res) => {
  try {
    const { title } = req.body;
    const filePath = req.file.path;
    const userId = req.user;
    const filetype = req.file.mimetype;

    if (!req.file || !title) {
        return res.status(400).json({ error: "Missing title or file" });
    }

    console.log(`Received title: ${title}`);
    console.log(`Received file: ${req.file.originalname}`);
    console.log(`Received user: ${userId}`);
    console.log({filetype});

    const newPost = await pool.query(
      "INSERT INTO posts (post_title, post_content, post_type, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, filePath, req.file.mimetype, userId]
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

    if (post.rows.length > 0) {
      return res.status(200).json({ isPosted: true });
    } else {
      return res.status(200).json({ isPosted: false });
    }


  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/posts", authorization, async (req, res) => {
    try {
        const posts = await pool.query(
            "SELECT * FROM posts ORDER BY created_at DESC"
        );
        res.json(posts.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;