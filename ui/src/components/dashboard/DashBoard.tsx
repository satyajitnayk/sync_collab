import { removeAuthTokenCookie, shortenStr } from '../../utils';
import TextEditor from '../TextEditor';
import { useDashBoard } from '../../hooks/useDashBoard';
import { useNavigate } from 'react-router-dom';

import '../../css/DashBoard.css';

export const DashBoard = () => {
  const navigate = useNavigate();
  const { documents, handleDocumentClick, saveNewFile, setCurrentContent } =
    useDashBoard();

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
    </>
  );
};
