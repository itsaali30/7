const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// WebSocket Server Setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received: %s', message);
  });
  ws.send('Connected to WebSocket Server');
});

// Airtable API Endpoint
const airtableAPI = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube';
const airtableConfig = {
  headers: {
    Authorization: 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a'
  }
};

// Fetch data from Airtable
app.get('/api/youtube', async (req, res) => {
  try {
    const response = await axios.get(airtableAPI, airtableConfig);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Set up WebSocket on HTTP Server
app.server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
