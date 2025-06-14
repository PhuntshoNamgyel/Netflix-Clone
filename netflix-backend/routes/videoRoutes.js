const express = require("express");
const multer = require("multer");
const supabase = require("../utils/supabaseClient");
const { PrismaClient } = require("@prisma/client");
const authenticate = require("../middleware/authMiddleware");

const prisma = new PrismaClient();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Upload Video to Supabase Storage
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const { title, description } = req.body;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Generate unique file name
    const fileName = `video-${Date.now()}.mp4`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("videos").upload(fileName, file.buffer, {
      contentType: "video/mp4",
    });

    if (error) return res.status(500).json({ error: "Failed to upload video", details: error });

    // Store metadata in database
    const video = await prisma.video.create({
      data: {
        title,
        description,
        url: `https://clegxumobdkwgepmtluw.supabase.co/storage/v1/object/public/videos/${fileName}`,
      },
    });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ✅ Fetch All Videos
router.get("/", async (req, res) => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos", details: err.message });
  }
});

// ✅ Get a Single Video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video", details: err.message });
  }
});

// ✅ Delete Video from Storage & Database
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) return res.status(404).json({ error: "Video not found" });

    const fileName = video.url.split("/").pop(); // Extract file name from URL

    // Remove file from Supabase Storage
    const { error } = await supabase.storage.from("videos").remove([fileName]);

    if (error) return res.status(500).json({ error: "Failed to delete video from storage", details: error });

    // Remove record from database
    await prisma.video.delete({ where: { id: req.params.id } });

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

module.exports = router;
