const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Airtable = require('airtable');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Airtable setup
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Serve static files for frontend (once built)
app.use(express.static('../frontend/dist'));

// Chat room setup with Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('message', (data) => {
        io.to(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Airtable integration to fetch room messages
app.get('/messages', async (req, res) => {
    try {
        const records = await base('Youtube').select().all();
        res.json(records.map(record => record.fields));
    } catch (error) {
        res.status(500).send('Error fetching messages from Airtable');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
