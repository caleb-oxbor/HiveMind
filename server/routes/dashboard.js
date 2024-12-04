const router = require("express").Router();
//const pool = require("../db");
const authorization = require("../middleware/authorization");
const multer = require('multer');
const path = require("path");
//const express = require("express");
const supabase = require("../supabaseClient");


// router.get('/', authorization, async (req, res) => {
//   try {
//     const { data: user, error: userError } = await supabase
//       .from('users')
//       .select('username')
//       .eq('user_id', req.user)
//       .single();
    
//     res.json(user);
//   }
//   catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

router.get('/', authorization, async (req, res) => {
  try {
    res.json({ username: req.user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/courses", authorization, async (req, res) => {
  try {
      const { data, error } = await supabase
          .from("courses")
          .select("course_name, course_code, course_id");

      if (error) {
          console.error("Error fetching courses:", error);
          return res.status(500).json({ error: "Failed to fetch course options" });
      }

      const formattedOptions = data.map((course) => ({
          value: `${course.course_id}`,
          label: `${course.course_code}: ${course.course_name}`
      }));

      res.status(200).json(formattedOptions);
  } catch (err) {
      console.error("Unexpected error fetching course options:", err.message);
      res.status(500).json({ error: "Failed to fetch course options" });
  }
});

router.get("/check-is-posted", authorization, async (req, res) => {
  const { userID, classID } = req.query;

  try {
      if (!userID || !classID) {
          return res.status(400).json({ error: "User ID and Class ID are required" });
      }

      const { data, error } = await supabase
          .from("posts") 
          .select("user_id, course_id") 
          .eq("user_id", userID)
          .eq("course_id", classID);

      if (error) {
          console.error("Error checking if user has posted:", error);
          return res.status(500).json({ error: "Failed to check post status" });
      }

      const isPosted = data.length > 0 ? 1 : 0;
      res.status(200).json({ isPosted });

  } catch (err) {
      console.error("Unexpected error checking post status:", err.message);
      res.status(500).json({ error: "Failed to check post status" });
  }
});


router.get("/user-classes", authorization, async (req, res) => {
  const { userID } = req.query;

  try {
      const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select("course_id")
          .eq("user_id", userID);

      if (postsError) {
          console.error("Error fetching user's posts:", postsError);
          return res.status(500).json({ error: "Failed to fetch user's posts" });
      }

      const uniqueClassIds = [...new Set(posts.map((post) => post.course_id))];

      const { data: courses, error: coursesError } = await supabase
          .from("courses")
          .select("course_id, course_name")
          .in("course_id", uniqueClassIds);

      if (coursesError) {
          console.error("Error fetching course details:", coursesError);
          return res.status(500).json({ error: "Failed to fetch course details" });
      }

      const classesWithNames = uniqueClassIds.map((classId) => {
          const course = courses.find((course) => course.course_id === classId);
          return {
              courseId: classId,
              courseName: course ? course.course_name : "Unknown Course",
          };
      });

      res.status(200).json(classesWithNames);
  } catch (err) {
      console.error("Unexpected error fetching user classes:", err.message);
      res.status(500).json({ error: "Failed to fetch user classes" });
  }
});


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, "uploads/"); // Save files in 'uploads/' directory
//   },
//   filename: (req, file, cb) => {
//       const uniqueName = Date.now() + path.extname(file.originalname);
//       cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage }); 

// router.post('/create-post', [authorization, upload.single('newPost')], async (req, res) => {
//   try {
//     const { title } = req.body;
//     const filePath = req.file.path;
//     const userId = req.user;
//     const filetype = req.file.mimetype;

//     if (!req.file || !title) {
//         return res.status(400).json({ error: "Missing title or file" });
//     }

//     console.log(`Received title: ${title}`);
//     console.log(`Received file: ${req.file.originalname}`);
//     console.log(`Received user: ${userId}`);
//     console.log({filetype});

//     const newPost = await pool.query(
//       "INSERT INTO posts (post_title, post_content, post_type, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
//       [title, filePath, req.file.mimetype, userId]
//     );

//     res.status(201).json({
//         message: "Post created successfully!",
//         post: newPost.rows[0],
//     });
//   } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//   }
// });

// router.get("/is-posted", authorization, async (req, res) => {
//   try {
//     const { data: user, error: userError } = await supabase
//       .from('users')
//       .select()
//     );

//     if (post.rows.length > 0) {
//       return res.status(200).json({ isPosted: true });
//     } else {
//       return res.status(200).json({ isPosted: false });
//     }


//   } catch(err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// router.get("/posts", authorization, async (req, res) => {
//     try {
//         const posts = await pool.query(
//             "SELECT * FROM posts ORDER BY created_at DESC"
//         );
//         res.json(posts.rows); 
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: "Server Error" });
//     }
// });


module.exports = router;