// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));

// Server Port (using environment variable or default to 8000)
const port = process.env.PORT || 8000;

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Project Data (initial state)
let projectData = {};

// Routes

// GET Route to fetch the weather data
app.get('/getWeather', (req, res) => {
  if (Object.keys(projectData).length === 0) {
    return res.status(404).send({ error: 'No weather data found' });
  }
  res.status(200).send(projectData);
});

// POST Route to add weather data
app.post('/addWeather', (req, res) => {
  const { temperature, date, userResponse } = req.body;

  // Validation for incoming data
  if (!temperature || !date || !userResponse) {
    return res.status(400).send({ error: 'Missing required fields (temperature, date, userResponse)' });
  }

  // Store the weather data
  projectData = { temperature, date, userResponse };

  // Send success response
  res.status(201).send({ message: 'Weather data added successfully!', data: projectData });
});

// Error handling for undefined routes
app.all('*', (req, res) => {
  res.status(404).send({ error: 'Route not found' });
});
