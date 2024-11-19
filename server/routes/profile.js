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
  const username = req.user.username;
  console.log("Fetching posts for username: ", username);
  try {

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const { data: metadata, error: metadataError } = await supabase
      .from("posts")
      .select("post_title, created_at, votes, file_name, file_type, username")
      .eq("username", username)
      .order("created_at", { ascending: false });

    if (metadataError) {
      console.error("Error fetching post metadata:", metadataError);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }

    console.log("Fetched posts: ", metadata);

    const combinedData = metadata.map((metaItem) => {
      const file_url = supabase.storage
        .from("userPosts")
        .getPublicUrl(`${username}/${metaItem.file_name}`).data.publicUrl;

      return {
        ...metaItem,
        file_url,
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