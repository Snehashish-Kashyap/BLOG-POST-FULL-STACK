import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PcController } from "../controllers/pcController.js";

const router = express.Router();

// ✅ Multer config
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
router.get("/", PcController.getAll);
router.get("/my", PcController.getMine);
router.get("/:id", PcController.getById);
router.post("/", upload.single("image"), PcController.create);
router.put("/:id", upload.single("image"), PcController.update);
router.delete("/:id", PcController.delete);

export default router;
