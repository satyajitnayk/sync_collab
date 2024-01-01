import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { webSocketURL } from '../config';

interface Message {
  username: string;
  content: string;
}

interface ChatPageProps {
  username: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ username }) => {
  const { chatroomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${webSocketURL}?chatroomId=${chatroomId}`);

    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prevMsg) => [...prevMsg, message]);
    };

    setSocket(ws);

    // Close WebSocket on component unmount
    return () => ws.close();
  }, [chatroomId]);

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
        <Link to="/">Back to Join Page</Link>
      </div>
      <div>
        <h2>Chat Room: {chatroomId}</h2>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}:</strong> {msg.content}
            </div>
          ))}
        </div>
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
    </div>
  );
};

export default ChatPage;
