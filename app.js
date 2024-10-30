const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Configure Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Route to render the form
app.get('/', (req, res) => {
  res.render('index'); // This will render 'views/index.ejs'
});

// POST route to handle form submission
app.post('/submit', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Set up FormData with the uploaded file
    const formData = new FormData();
    formData.append('images', fs.createReadStream(imagePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('organs', 'auto'); // Assuming "auto" as the organ type

    // Prepare request URL with API key and token
    const url = `https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&nb-results=1&lang=en&type=kt&api-key=2b10F374h8bBydDT7yaJ25s2Au&authenix-access-token=2b10F374h8bBydDT7yaJ25s2Au`;
    const headers = {
      ...formData.getHeaders(),
      'accept': 'application/json'
    };

    // Send the POST request to the API
    const response = await axios.post(url, formData, { headers });

    // Delete the uploaded file after processing
    fs.unlinkSync(imagePath);

    // Render the response data on a results page
    res.render('result', { data: response.data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process the request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

