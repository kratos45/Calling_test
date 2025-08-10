const WebSocket = require('ws');

// Use the port Railway provides or default to 3000 locally
const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);
  console.log('Client connected. Total clients:', clients.length);

  ws.on('message', function incoming(message) {
    // Broadcast the received message to all other clients (except sender)
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // If you want loopback (send message back to sender), uncomment below:
    // if (ws.readyState === WebSocket.OPEN) {
    //   ws.send(message);
    // }
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected. Total clients:', clients.length);
  });
});

console.log(`Signaling server running on ws://localhost:${PORT}`);
