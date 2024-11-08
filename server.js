const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON bodies for POST requests
app.use(bodyParser.json());

// Airtable API configuration
const airtableAPI = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube';
const airtableConfig = {
  headers: {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  }
};

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send current Airtable data to new WebSocket client
  ws.send(JSON.stringify({ message: 'Connected to WebSocket', data: airtableData }));

  ws.on('message', (message) => {
    console.log('Received: %s', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Fetch data from Airtable and send it to WebSocket clients
let airtableData = [];

const fetchDataFromAirtable = async () => {
  try {
    const response = await axios.get(airtableAPI, airtableConfig);
    airtableData = response.data.records;
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);
  }
};

// Fetch Airtable data initially
fetchDataFromAirtable();

// Route to get data from Airtable
app.get('/data', async (req, res) => {
  try {
    // Respond with the current Airtable data
    await fetchDataFromAirtable();  // Ensure we have the latest data
    res.json(airtableData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Airtable' });
  }
});

// Endpoint to receive real-time updates from services like Zapier or Integromat
app.post('/webhook', (req, res) => {
  const newData = req.body; // Data from Zapier/Integromat
  
  // Update the Airtable data and send to WebSocket clients
  airtableData = newData;
  
  // Push the new data to all WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(newData));
    }
  });

  res.status(200).send('Data received');
});

// Start the Express server
app.server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const cors = require('cors');
app.use(cors({ origin: 'https://itsaali30.github.io' }));

// Upgrade HTTP server to support WebSockets
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
