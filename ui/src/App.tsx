// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

interface Message {
  username: string;
  content: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws');

    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prevMsg) => [...prevMsg, message]);
    };

    setSocket(ws);

    // close websocket
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    const message: Message = { username, content };
    if (socket) {
      socket.send(JSON.stringify(message));
    }
    setContent('');
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter your message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
