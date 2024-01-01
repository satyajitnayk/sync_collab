import { useNavigate } from 'react-router-dom';
import { documents } from '../../assets';
import {
  getAuthTokenFromCookie,
  removeAuthTokenCookie,
  shortenStr,
} from '../../utils';
import { useEffect } from 'react';
import TextEditor from '../TextEditor';

import '../../css/DashBoard.css';
import { CreateNewFile } from './CreateNewFile';

export const DashBoard = () => {
  const navigate = useNavigate();

  const handleDocumentClick = (documentId: number) => {
    navigate(`/document/${documentId}`);
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
          <button>save</button>
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
            <TextEditor />
          </div>
        </div>
      </div>
      <CreateNewFile />
    </>
  );
};
