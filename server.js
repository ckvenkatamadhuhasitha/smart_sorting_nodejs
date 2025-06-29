const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Multer config to store uploaded images
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// POST /predict route — sends image to Python backend
app.post("/predict", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;

  const form = new FormData();
  form.append("image", fs.createReadStream(imagePath));

  try {
    const response = await axios.post("https://smart-sorting-backend.onrender.com/predict", form, {
      headers: form.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ prediction: "Error" });
  } finally {
    fs.unlinkSync(imagePath); // Clean up uploaded file
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
