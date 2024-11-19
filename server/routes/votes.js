const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const authorization = require("../middleware/authorization");

router.post("/upvote", authorization, async (req, res) => {
    const {postID}  = req.body;

    console.log("Upvote request received:", postID );

    try {
        const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("votes")
        .eq("file_name", postID)
        .single();

        if (fetchError) {
            console.error("Error fetching post:", fetchError.message);
            return res.status(400).json({ error: "Post not found" });
        }

        const newVotes = (post.votes || 0) + 1;

        const { error: updateError } = await supabase
            .from("posts")
            .update({ votes: newVotes })
            .eq("file_name", postID);

        if (updateError) {
            console.error("Error updating votes:", updateError.message);
            return res.status(400).json({ error: "Failed to update votes" });
        }

        res.status(200).json({ message: "Upvote successful" });
    } catch (err) {
        console.error("Unexpected error updating table:", err.message);
        res.status(500).json({ error: "Failed to upvote" });
    }
});

router.post("/downvote", authorization, async (req, res) => {
    const {postID}  = req.body;

    console.log("Downvote request received:", postID );

    try {
        const { data: post, error: fetchError } = await supabase
            .from("posts")
            .select("votes")
            .eq("file_name", postID)
            .single();

        if (fetchError) {
            console.error("Error fetching post:", fetchError.message);
            return res.status(400).json({ error: "Post not found" });
        }

        const newVotes = (post.votes || 0) - 1;

        const { error: updateError } = await supabase
            .from("posts")
            .update({ votes: newVotes })
            .eq("file_name", postID);

        if (updateError) {
            console.error("Error updating votes:", updateError.message);
            return res.status(400).json({ error: "Failed to update votes" });
        }

        res.status(200).json({ message: "Downvote successful" });

    } catch (err) {
        console.error("Unexpected error updating table:", err.message);
        res.status(500).json({ error: "Failed to downvote" });
    }
});

module.exports = router;
