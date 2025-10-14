import { PcModel } from "../models/PcModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey123";

export const PcController = {
  // ✅ Get all blogs
  async getAll(req, res) {
    try {
      const pcs = await PcModel.getAll();
      res.json(pcs);
    } catch (error) {
      console.error("Error fetching PCs:", error);
      res.status(500).json({ error: "Failed to fetch PCs" });
    }
  },

  // ✅ Get my blogs
  async getMine(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded = jwt.verify(token, JWT_SECRET);
      const pcs = await PcModel.getByUserId(decoded.id);

      res.json(pcs);
    } catch (error) {
      console.error("Error fetching user's PCs:", error);
      res.status(500).json({ error: "Failed to fetch user's PCs" });
    }
  },

  // ✅ Get single blog
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pc = await PcModel.getById(id);

      if (!pc) return res.status(404).json({ error: "Blog not found" });

      res.json(pc);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: "Failed to load blog details" });
    }
  },

  // ✅ Create blog
  async create(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { name, description, full_description } = req.body;
      const image_url = req.file ? `/images/${req.file.filename}` : null;

      const pc = await PcModel.create({
        name,
        description,
        image_url,
        full_description,
        userId: decoded.id,
      });

      res.json({ message: "✅ Blog added successfully!", pc });
    } catch (error) {
      console.error("Error adding PC:", error);
      res.status(500).json({ error: "Failed to add blog" });
    }
  },

  // ✅ Update blog
  async update(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { id } = req.params;
      const { name, description, full_description } = req.body;
      const image_url = req.file
        ? `/images/${req.file.filename}`
        : req.body.image_url;

      const isOwner = await PcModel.checkOwner(id, decoded.id);
      if (!isOwner) return res.status(403).json({ error: "Access denied" });

      const pc = await PcModel.update({
        id,
        name,
        description,
        image_url,
        full_description,
      });

      res.json({ message: "✅ Blog updated!", pc });
    } catch (error) {
      console.error("Error updating PC:", error);
      res.status(500).json({ error: "Failed to update blog" });
    }
  },

  // ✅ Delete blog
  async delete(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { id } = req.params;

      const isOwner = await PcModel.checkOwner(id, decoded.id);
      if (!isOwner) return res.status(403).json({ error: "Access denied" });

      await PcModel.delete(id);
      res.json({ message: "🗑️ Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting PC:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  },
};
