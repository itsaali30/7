const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

const airtableURL = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube';
const airtableConfig = {
  headers: {
    Authorization: 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a'
  }
};

app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(airtableURL, airtableConfig);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Airtable' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('fetchData', async () => {
    try {
      const response = await axios.get(airtableURL, airtableConfig);
      socket.emit('data', response.data);
    } catch (error) {
      socket.emit('error', 'Error fetching data from Airtable');
    }
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
