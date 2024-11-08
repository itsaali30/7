const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const AIRTABLE_URL = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube';
const AIRTABLE_CONFIG = { headers: { Authorization: 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a' } };

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('fetchData', async () => {
    try {
      const response = await axios.get(AIRTABLE_URL, AIRTABLE_CONFIG);
      socket.emit('data', response.data);
    } catch (error) {
      console.error(error);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Socket.IO Server is running');
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
