
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.static('frontend'));

app.post('/predict', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;
    exec(`python3 backend/predict.py ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: 'Prediction failed' });
        }
        res.json({ prediction: stdout.trim() });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
