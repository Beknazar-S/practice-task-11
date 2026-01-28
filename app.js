require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const itemsRouter = require("./routes/items");

const app = express();
app.use(express.json());

// Health / root endpoint
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// API routes
app.use("/api/items", itemsRouter);

// Start only after DB connect
async function start() {
  const PORT = process.env.PORT || 3000;
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("Missing MONGO_URI in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

start();