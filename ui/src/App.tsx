import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './components/JoinPage';
import ChatPage from './components/ChatPage';
import TextEditor from './components/TextEditor';
import './App.css';

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
        <Route path="/doc" element={<TextEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
