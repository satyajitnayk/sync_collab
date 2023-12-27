// src/JoinPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JoinPageProps {
  joinChat: (username: string, chatroomId: string) => void;
}

const JoinPage: React.FC<JoinPageProps> = ({ joinChat }) => {
  const [username, setUsername] = useState('');
  const [chatroomId, setChatroomId] = useState('');
  const navigate = useNavigate();

  const handleJoinChat = () => {
    if (username && chatroomId) {
      joinChat(username, chatroomId);
      navigate(`/chat/${chatroomId}`);
    }
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
        <input
          type="text"
          placeholder="Enter chatroom ID"
          value={chatroomId}
          onChange={(e) => setChatroomId(e.target.value)}
        />
        <button onClick={handleJoinChat}>Join Chat</button>
      </div>
    </div>
  );
};

export default JoinPage;
