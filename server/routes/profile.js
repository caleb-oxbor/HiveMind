const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const supabase = require("../supabaseClient");
const path = require("path");

router.get('/', authorization, async (req, res) => {
  try {

    const { data: user, error: userError } = await supabase //query supabase to collect all user data
      .from('users')
      .select('username, email')
      .eq('user_id', req.user.user_id)
      .single();

    res.json(user);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/profile-posts", authorization, async (req, res) => {
  const username = req.user.username; //sets username
  // console.log("Fetching posts for username: ", username);
  try {

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const { data: metadata, error: metadataError } = await supabase //query multiple tables for filtering
      .from("posts")
      .select("*")
      .eq("username", username)
      .order("course_id", { ascending: true })
      .order("created_at", { ascending: false });

    if (metadataError) {
      console.error("Error fetching post metadata:", metadataError);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }

    const courseIds = [...new Set(metadata.map(metaItem => metaItem.course_id))]; //use user table info to query course table info
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("course_id, course_name")
      .in("course_id", courseIds);

    if (coursesError) {
      console.error("Error fetching course data: ", coursesError);
      return res.status(500).json({ error: "Failed to fetch courses" });
    }

    const courseIdToName = courses.reduce((acc, course) => { //if no course, allocate it
      acc[course.course_id] = course.course_name;
      return acc;
    }, {});

    const combinedData = metadata.map((metaItem) => {
      const file_url = supabase.storage
        .from("userPosts")
        .getPublicUrl(`${username}/${metaItem.file_name}`).data.publicUrl;

      return { //export metadata.
        ...metaItem,
        file_url,
        course_name: courseIdToName[metaItem.course_id],
      };
    });

    res.status(200).json(combinedData);
  } 
  catch (err) {
    console.error("Error fetching user posts:", err.message);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

module.exports = router;