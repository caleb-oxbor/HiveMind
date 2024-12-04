const express = require("express");
const router = express.Router();
const multer = require("multer");
const supabase = require("../supabaseClient");
const authorization = require("../middleware/authorization");
// const libre = require("libreoffice-convert");
// const fs = require("fs");
// const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", authorization, async (req, res) => {
  try {
    const { username, user_id } = req.user;
    res.json({ username, user_id });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

router.post("/", authorization, upload.single("file"), async (req, res) => {
  const { post_title, post_id, classID, file_type } = req.body;
  const { buffer, originalname } = req.file;

  try {
    const userFilePath = `${req.user.username}/${post_id}`;
    const classFilePath = `${classID}/${post_id}`;
    // const pdfFilePath = `${classID}/${post_id}.pdf`;

    const [userUpload, classUpload] = await Promise.all([
      supabase.storage.from("userPosts").upload(userFilePath, buffer, {
        contentType: file_type,
      }),
      supabase.storage.from("classPosts").upload(classFilePath, buffer, {
        contentType: file_type,
      }),
    ]);

    if (userUpload.error || classUpload.error) {
      return res.status(400).json({ error: "File upload failed." });
    }

    // let pdfBuffer = null;
    // const supportedFormats = ["application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "application/vnd.openxmlformats-officedocument.presentationml.presentation"];

    // if (supportedFormats.includes(file_type)) {
    //   pdfBuffer = await new Promise((resolve, reject) => {
    //     libre.convert(buffer, ".pdf", undefined, (err, done) => {
    //       if (err) {
    //         return reject(`Error converting file to PDF: ${err.message}`);
    //       }
    //       resolve(done);
    //     });
    //   });
    //   const pdfUpload = await supabase.storage.from("classPosts").upload(pdfFilePath, pdfBuffer, {
    //     contentType: "application/pdf",
    //   });

    //   if (pdfUpload.error) {
    //     return res.status(400).json({ error: "Failed to upload converted PDF." });
    //   }
    // }

    await supabase.from("posts").insert({
      user_id: req.user.user_id,
      course_id: classID,
      post_title: post_title,
      created_at: new Date().toISOString(),
      username: req.user.username,
      file_name: post_id,
      file_type,
      // pdf_url: pdfBuffer ? `${classID}/${post_id}.pdf` : null,
    });

    res.status(200).json({ message: "File uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file." });
  }
});

module.exports = router;  