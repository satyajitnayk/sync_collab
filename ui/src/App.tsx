import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './components/JoinPage';
import ChatPage from './components/ChatPage';
import TextEditor from './components/TextEditor';
import './App.css';
import { ProjectMangement } from './components/draganddrop/ProjectMangement';
import NotFoundPage from './components/NotFoundPage';
import { ContextInImageSize } from './components/contextpage/ContextInImageSize';
import { ContextInHeading } from './components/contextpage/ContextInHeading';
import { BouncingBalls } from './components/bouncingballs/BouncingBall';
import { Registration } from './components/Registration';
import { Login } from './components/Login';
import { DashBoard } from './components/dashboard/DashBoard';
import { Home } from './components/Home';
import { TextEditorWithContent } from './components/TextEditorWithContent';
import { DocumentsProvider } from './context/DocumentsContext';

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
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <DocumentsProvider>
              <DashBoard />
            </DocumentsProvider>
          }
        />
        <Route
          path="/document/:documentId"
          element={
            <DocumentsProvider>
              <TextEditorWithContent />
            </DocumentsProvider>
          }
        />

        <Route path="/joinchat" element={<JoinPage joinChat={joinChat} />} />
        <Route
          path="/chat/:chatroomId"
          element={<ChatPage username="placeholder" />}
        />
        <Route path="/doc" element={<TextEditor />} />
        <Route path="/project" element={<ProjectMangement />} />
        <Route path="/context/imagesize" element={<ContextInImageSize />} />
        <Route path="/context/headings" element={<ContextInHeading />} />
        <Route path="/bounceballs" element={<BouncingBalls />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
