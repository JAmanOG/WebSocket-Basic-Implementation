"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const httpServer = app.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});
app.get('/', function (_, res) {
    res.send('Hello! Message From Server!!');
});
const wss = new ws_1.WebSocketServer({ server: httpServer });
let userCount = 0;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
            console.log('Received Message: %s', data);
        });
        console.log('User Count:', ++userCount);
        ws.send('Hello! Message From Server!!');
    });
    ws.send('Hello! Message From Server!!');
});
