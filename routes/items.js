const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/item");

const router = express.Router();

// GET /api/items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ count: items.length, items });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id format" });
  }

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// POST /api/items
router.post("/", async (req, res) => {
  const { name, price, category } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({ error: "name, price, category are required" });
  }

  try {
    const created = await Item.create({ name, price, category });
    res.status(201).json({ message: "Item created", item: created });
  } catch (err) {
    res.status(400).json({ error: "Validation error", details: err.message });
  }
});

// PUT /api/items/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id format" });
  }

  try {
    const updated = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item updated", item: updated });
  } catch (err) {
    res.status(400).json({ error: "Update error", details: err.message });
  }
});

// DELETE /api/items/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id format" });
  }

  try {
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item deleted", item: deleted });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;