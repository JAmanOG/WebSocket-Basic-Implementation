import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();

const httpServer = app.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

app.get('/', function(_, res) {
  res.send('Hello! Message From Server!!');
});

const wss = new WebSocketServer({ server: httpServer });
let userCount = 0;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }

    console.log('Received Message: %s', data);
    });

    console.log('User Count:', ++userCount);
    ws.send('Hello! Message From Server!!');
  });

  ws.send('Hello! Message From Server!!');
});
