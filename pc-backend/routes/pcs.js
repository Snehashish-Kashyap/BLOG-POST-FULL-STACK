import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PcController } from "../controllers/pcController.js";

const router = express.Router();

// ✅ Multer configuration (for image uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/images";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Routes
router.get("/", PcController.getAll);                // All blogs
router.get("/my", PcController.getMine);             // User’s blogs
router.get("/my/count", PcController.getMyCount);    // ✅ Blog count (for Profile)
router.get("/:id", PcController.getById);            // Single blog
router.post("/", upload.single("image"), PcController.create); // Create blog
router.put("/:id", upload.single("image"), PcController.update); // Update blog
router.delete("/:id", PcController.delete);          // Delete blog

export default router;
