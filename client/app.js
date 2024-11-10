// app.js
const socket = new WebSocket('wss://your-backend-websocket-url');

socket.onopen = () => {
  console.log('Connected to WebSocket server');
};

socket.onmessage = (event) => {
  const messages = document.getElementById('messages');
  messages.textContent += `\nServer: ${event.data}`;
};

function sendMessage() {
  const message = document.getElementById('messageInput').value;
  socket.send(message);
}
