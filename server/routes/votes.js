    const express = require("express");
    const router = express.Router();
    const supabase = require("../supabaseClient");
    const authorization = require("../middleware/authorization");

    router.get("/", authorization, async (req, res) => {
        const userID = req.user.user_id;

        try {
            const { data: votes, error } = await supabase
                .from("votes")
                .select("post_id, vote_type")
                .eq("user_id", userID);

            if (error) {
                throw new Error(error.message);
            }

            res.json(votes);
        } catch (err) {
            console.error("Error fetching votes:", err.message);
            res.status(500).json({ error: "Failed to fetch user votes" });
        }
    });


    router.post("/upvote", authorization, async (req, res) => {
        const {postID}  = req.body;
        const userID = req.user.user_id;

        console.log("Upvote request received:", postID );

        try {
            const { data: existingVote, error: voteFetchError } = await supabase
                .from("votes")
                .select("*")
                .eq("user_id", userID)
                .eq("post_id", postID)
                .single();


            if (voteFetchError && voteFetchError.code !== "PGRST116") {
                console.error("Error fetching vote record:", voteFetchError.message);
                return res.status(500).json({ error: "Failed to fetch vote record" });
            }

            if (existingVote) {
                if (existingVote.vote_type === "upvote") {
                    return res.status(400).json({ message: "You have already upvoted this post." });
                }
                if (existingVote.vote_type === "downvote") {
                    const { error: voteUpdateError } = await supabase
                        .from("votes")
                        .update({ is_voted: true, vote_type: "upvote" })
                        .eq("user_id", userID)
                        .eq("post_id", postID);

                    if (voteUpdateError) {
                        console.error("Error updating vote record:", voteUpdateError.message);
                        return res.status(500).json({ error: "Failed to update vote record" });
                    }

                    const { data: post, error: fetchError } = await supabase
                    .from("posts")
                    .select("votes")
                    .eq("file_name", postID)
                    .single();
        
                    if (fetchError) {
                        console.error("Error fetching post:", fetchError.message);
                        return res.status(400).json({ error: "Post not found" });
                    }
            
                    const newVotes = (post.votes || 0) + 2;
            
                    const { error: updateError } = await supabase
                        .from("posts")
                        .update({ votes: newVotes })
                        .eq("file_name", postID);
            
                    if (updateError) {
                        console.error("Error updating votes:", updateError.message);
                        return res.status(400).json({ error: "Failed to update votes" });
                    }
                    console.log("new votes:", newVotes);

                }
            } else {
                const { error: voteInsertError } = await supabase
                    .from("votes")
                    .insert([
                        {
                            user_id: userID,
                            post_id: postID,
                            is_voted: true,
                            vote_type: "upvote",
                        },
                    ]);

                if (voteInsertError) {
                    console.error("Error inserting vote record:", voteInsertError.message);
                    return res.status(500).json({ error: "Failed to insert vote record" });
                }

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
                console.log("new votes:", newVotes);

            }

            res.status(200).json({ message: "Upvote successful" });
        } catch (err) {
            console.error("Unexpected error updating table:", err.message);
            res.status(500).json({ error: "Failed to upvote" });
        }
    });

    router.post("/downvote", authorization, async (req, res) => {
        const {postID}  = req.body;
        const userID = req.user.user_id;

        console.log("Downvote request received:", postID );

        try {
            const { data: existingVote, error: voteFetchError } = await supabase
                .from("votes")
                .select("*")
                .eq("user_id", userID)
                .eq("post_id", postID)
                .single();


            if (voteFetchError && voteFetchError.code !== "PGRST116") {
                console.error("Error fetching vote record:", voteFetchError.message);
                return res.status(500).json({ error: "Failed to fetch vote record" });
            }

            if (existingVote) {
                if (existingVote.vote_type === "downvote") {
                    console.log("already downvoted");
                    return res.status(400).json({ message: "You have already downvoted this post." });
                }
                if (existingVote.vote_type === "upvote") {
                    console.log("upvoted, switching to downvote");
                    const { error: voteUpdateError } = await supabase
                        .from("votes")
                        .update({ is_voted: true, vote_type: "downvote" })
                        .eq("user_id", userID)
                        .eq("post_id", postID);

                    if (voteUpdateError) {
                        console.error("Error updating vote record:", voteUpdateError.message);
                        return res.status(500).json({ error: "Failed to update vote record" });
                    }

                    const { data: post, error: fetchError } = await supabase
                    .from("posts")
                    .select("votes")
                    .eq("file_name", postID)
                    .single();
        
                    if (fetchError) {
                        console.error("Error fetching post:", fetchError.message);
                        return res.status(400).json({ error: "Post not found" });
                    }
            
                    const newVotes = (post.votes || 0) - 2;
                    console.log("new votes:", newVotes);
            
                    const { error: updateError } = await supabase
                        .from("posts")
                        .update({ votes: newVotes })
                        .eq("file_name", postID);
            
                    if (updateError) {
                        console.error("Error updating votes:", updateError.message);
                        return res.status(400).json({ error: "Failed to update votes" });
                    }
                }
            } else {
                const { error: voteInsertError } = await supabase
                    .from("votes")
                    .insert([
                        {
                            user_id: userID,
                            post_id: postID,
                            is_voted: true,
                            vote_type: "downvote",
                        },
                    ]);

                if (voteInsertError) {
                    console.error("Error inserting vote record:", voteInsertError.message);
                    return res.status(500).json({ error: "Failed to insert vote record" });
                }

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
                console.log("new votes:", newVotes);


            }

            res.status(200).json({ message: "Downvote successful" });

        } catch (err) {
            console.error("Unexpected error updating table:", err.message);
            res.status(500).json({ error: "Failed to downvote" });
        }
    });

    module.exports = router;
