const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
});

// Fetch data from Airtable API and send it to WebSocket clients
const airtableURL = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube';
const airtableConfig = {
  headers: { Authorization: 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a' }
};

setInterval(() => {
  axios.get(airtableURL, airtableConfig)
    .then(response => {
      const data = response.data.records;
      // Send data to WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    })
    .catch(error => {
      console.error('Error fetching Airtable data:', error);
    });
}, 5000);
app.use(cors());

// HTTP server to handle Express and WebSocket connections
app.server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Upgrade HTTP server to handle WebSocket connections
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
