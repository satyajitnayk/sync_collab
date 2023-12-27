// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './components/JoinPage';
import ChatPage from './components/ChatPage';

const App: React.FC = () => {
  const joinChat = (username: string, chatroomId: string) => {
    // Add logic for joining chat here
    console.log(
      `Joining chat with username: ${username} and chatroom ID: ${chatroomId}`
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage joinChat={joinChat} />} />
        <Route
          path="/chat/:chatroomId"
          element={<ChatPage username="placeholder" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
