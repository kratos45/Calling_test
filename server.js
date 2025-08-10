const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket signaling server running\n');
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);
  console.log('Client connected. Total clients:', clients.length);

  ws.on('message', function incoming(message) {
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected. Total clients:', clients.length);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
