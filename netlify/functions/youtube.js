const WebSocket = require('ws');
const axios = require('axios');

const airtableAPI = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube';
const airtableConfig = {
  headers: {
    Authorization: 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a'
  }
};

let wss;  // WebSocket server
let airtableData = [];

// Poll Airtable every 30 seconds for changes (or adjust the interval as needed)
const fetchDataFromAirtable = async () => {
  try {
    const response = await axios.get(airtableAPI, airtableConfig);
    const newData = response.data.records;
    // Check if the data has changed
    if (JSON.stringify(newData) !== JSON.stringify(airtableData)) {
      airtableData = newData;
      // Broadcast the new data to all connected WebSocket clients
      if (wss) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(airtableData));
          }
        });
      }
    }
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);
  }
};

// Poll Airtable every 30 seconds
setInterval(fetchDataFromAirtable, 30000);

exports.handler = async function(event, context) {
  if (!wss) {
    // Create WebSocket server
    wss = new WebSocket.Server({ noServer: true });
    wss.on('connection', (ws) => {
      // Send current data to new clients
      ws.send(JSON.stringify(airtableData));

      ws.on('message', (message) => {
        console.log('Received: %s', message);
      });
    });
  }

  return {
    statusCode: 200,
    body: 'WebSocket Server is running.'
  };
};
