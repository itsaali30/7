const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const airtableUrl = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube';
const airtableConfig = {
  headers: { Authorization: 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a' }
};

app.use(express.static('public')); // Serve static files from the public folder

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('getData', async () => {
    try {
      const response = await axios.get(airtableUrl, airtableConfig);
      socket.emit('data', response.data);
    } catch (error) {
      console.error('Error fetching Airtable data:', error);
      socket.emit('error', { message: 'Failed to retrieve data' });
    }
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
