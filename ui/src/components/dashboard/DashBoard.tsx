import { useNavigate } from 'react-router-dom';
import {
  getAuthTokenFromCookie,
  removeAuthTokenCookie,
  shortenStr,
} from '../../utils';
import { useEffect, useState } from 'react';
import TextEditor from '../TextEditor';

import '../../css/DashBoard.css';
import { CreateNewFile } from './CreateNewFile';
import { useDocuments } from '../../context/DocumentsContext';
import { TextDocument } from '../../interfaces';

export const DashBoard = () => {
  const [currentContent, setCurrentContent] = useState<string>('');
  const { documents, updateDocuments } = useDocuments();

  const navigate = useNavigate();

  const handleDocumentClick = (documentId: number) => {
    navigate(`/document/${documentId}`);
  };

  const saveNewFile = () => {
    if (currentContent === '') return;
    const newDocInfo: TextDocument = {
      userId: Math.floor(Math.random() * 1000),
      id: Math.floor(Math.random() * 100),
      fileName: 'file_' + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: currentContent,
    };
    console.log([...documents, newDocInfo]);
    updateDocuments([...documents, newDocInfo]);
  };

  useEffect(() => {
    const isLoggedIn = getAuthTokenFromCookie() ? true : false;
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <div className="dashboard-conatiner">
        <div className="dashboard-header">
          <h3>Welcome Satya!!</h3>
          <button className="save-new-file" onClick={saveNewFile}>
            save
          </button>
          <button
            onClick={() => {
              removeAuthTokenCookie();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>

        <div className="dashboard-content">
          <div className="document-content">
            {documents.map((document) => (
              <div
                className="document"
                key={document.id}
                onClick={() => handleDocumentClick(document.id)}
                style={{ cursor: 'pointer' }}
              >
                {shortenStr(document.fileName)}
              </div>
            ))}
          </div>
          <div className="text-editor-conatnier">
            <TextEditor onContentChange={setCurrentContent} />
          </div>
        </div>
      </div>
      <CreateNewFile />
    </>
  );
};
