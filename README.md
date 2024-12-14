# **What is Backend Communication?**

Backend communication is the unseen interaction between the server-side components of a web application. It involves the exchange of data and instructions between servers, databases, and other services to process user requests, retrieve information, and generate responses

It is not recommended to store all data on a single backend server, such as **Next.js** or **Golang**, especially when you don't want sensitive data exposed on the internet.

The primary backend should handle the core functionality of your system. For example, when you pay someone using GPay, the payment processing is handled by the main backend, but tasks like sending notifications (e.g., arriving 10 seconds later) are processed asynchronously on a **sub-backend**. This design pattern is also known as **microservices**.  

![image](https://github.com/user-attachments/assets/bd2ba740-6d8e-4b66-a09a-187df20924bb)

  

# **Types of Communication**

## **1\. Synchronous Communication (Strong Coupling)**

In synchronous communication, the client must **wait for a response** (acknowledgement) from the server before proceeding.

* **Example**: HTTP, WebSockets (when used for synchronous tasks).
    
* **How it works**: For instance, when sending a message over HTTP, the user waits until the server acknowledges the request and responds.
    

---

##   
**2\. Asynchronous Communication (Weak Coupling)**

In asynchronous communication, no immediate acknowledgement is required. The server sends the message without waiting for confirmation on whether it was received.

* **Example**: Message Queues (e.g., RabbitMQ), Pub/Sub systems, WebSockets (for event-based messaging).
    
* **How it works**: Tasks are processed independently, and communication happens without blocking other operations.
    

---

![image](https://github.com/user-attachments/assets/b0a550b6-c1f3-4e75-a4f9-fc99cb191e36)

## **WebSocket**

WebSockets provide a way to establish a **persistent, full-duplex communication channel** over a single TCP connection between the client (e.g., a browser) and the server.

### **WebSocket vs HTTP**

* **HTTP**: Stateless and request-based; communication happens in one direction where the client makes requests, and the server responds
    
  ![image](https://github.com/user-attachments/assets/72742911-c512-4ce5-a4ad-60ff4286b66b)
    
* **WebSocket**: Persistent and bidirectional; both the client and server can send messages to each other. A one-time handshake initiates the connection.
    
  ![image](https://github.com/user-attachments/assets/7859c35b-0f78-494a-a67b-df571bdecc32)
    

WebSockets are rarely used for backend-to-backend communication; they are primarily used for communication between the **browser** and the **server**.  

![image](https://github.com/user-attachments/assets/e33f1a54-6f08-4a57-9201-20e08bf90040)

---

### **Use Cases for WebSockets**

* **Real-Time Applications**: Chat applications, live sports updates, and real-time gaming.
    
* **Live Feeds**: Financial tickers, news updates, and social media streams.
    
* **Interactive Services**: Collaborative editing tools, live customer support, and webinars.
    

---

## **Code for Implementing a WebSocket Server**

The following code demonstrates a simple WebSocket server using Node.js with Express and `ws`:

```javascript
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();

// HTTP server
const httpServer = app.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

app.get('/', function (_, res) {
  res.send('Hello! Message From Server!!');
});

// WebSocket server
const wss = new WebSocketServer({ server: httpServer });
let userCount = 0;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });

    console.log('Received Message: %s', data);
    console.log('User Count:', ++userCount);
    ws.send('Hello! Message From Server!!');
  });

  ws.send('Hello! Message From Server!!');
});
```

---

## **Code for Implementing a WebSocket Client in React**

Here is a basic React client to communicate with the WebSocket server:

```tsx
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [latestMessage, setLatestMessage] = useState<string>('');

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log('Connection established');
      newSocket.send('Hello Server!');
      setSocket(newSocket);
    };

    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
      setLatestMessage(message.data);
    };

    return () => newSocket.close();
  }, []);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <>
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => socket.send(message)}>Send Message</button>
      {latestMessage}
    </>
  );
}

export default App;
```

## **Client 3**

![image](https://github.com/user-attachments/assets/fc8053ab-9390-42b5-9f98-64c7d936501c)

## **Client 2**

![image](https://github.com/user-attachments/assets/70225e4a-bb78-4ad0-99e4-7e8b269e77ce)

---

# **Scaling WebSocket Servers**

In real-world applications, scaling WebSocket servers is crucial, especially as traffic increases.

### **WebSocket Fleet**

To scale WebSocket servers:

1. Deploy multiple WebSocket servers in a **fleet**.
    
2. Use a central layer (e.g., a load balancer or message broker) to **orchestrate messages** between clients and servers.
    
3. Keep WebSocket servers **stateless** to ensure scalability and consistency across the fleet.
    

This approach allows WebSocket servers to handle high traffic efficiently and ensures seamless communication between the client and backend systems.
