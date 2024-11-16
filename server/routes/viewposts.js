const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    const { classID } = req.query;

  try {
    if (!classID) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const { data: metadata, error: metadataError } = await supabase
      .from("posts")
      .select("user_id, username, post_title, created_at, upvotes, downvotes, file_name, file_type")
      .eq("course_id", classID);

    if (metadataError) {
      console.error("Error fetching metadata:", metadataError);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }

    const combinedData = metadata.map((metaItem) => {
      const file_url = supabase.storage
        .from("classPosts")
        .getPublicUrl(`${classID}/${metaItem.file_name}`).data.publicUrl;

      return {
        ...metaItem,
        file_url,
      };
    });

    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Unexpected error fetching posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = router;
