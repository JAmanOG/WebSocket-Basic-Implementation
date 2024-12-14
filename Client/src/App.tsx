import { useEffect, useState } from 'react'
import './App.css'

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
    }
    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
      setLatestMessage(message.data);
    }
    setSocket(newSocket);

    return () => newSocket.close();
  }, [])

  if (!socket) {
    return <div>Connecting...</div>
  }

  return (
    <>
      <input type="text" 
      onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={() => socket.send(
        message
      )}>Send Message</button>
      {latestMessage}
    </>
  )
}

export default App