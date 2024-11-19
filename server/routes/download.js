const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const authorization = require("../middleware/authorization");

router.get("/:classID/:postID", authorization, async (req, res) => {
    const { classID, postID } = req.params;

    console.log("Download request received:", { classID, postID });

    try {
        const { data, error } = await supabase.storage
            .from("classPosts")
            .download(`${classID}/${postID}`);

        if (error) {
            console.error("Supabase download error:", error.message);
            return res.status(404).json({ error: "File not found in storage" });
        }

        const arrayBuffer = await data.arrayBuffer(); // Convert Blob to ArrayBuffer
        const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

        const { data: metadata, error: metadataError } = await supabase
            .from("posts")
            .select("file_type")
            .eq("file_name", postID)
            .single();

        if (metadataError) {
            console.error("Database metadata error:", metadataError.message);
            return res.status(500).json({ error: "Failed to retrieve file metadata" });
        }

        const fileType = metadata.file_type || "application/octet-stream";
        const fileExtension = fileType.split("/")[1] || "bin"; 

        res.setHeader("Content-Type", fileType);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${postID}.${fileExtension}"`
        );
        res.setHeader("Content-Length", buffer.length);

        res.end(buffer);
    } catch (err) {
        console.error("Unexpected error serving file:", err.message);
        res.status(500).json({ error: "Failed to serve file" });
    }
});

module.exports = router;
