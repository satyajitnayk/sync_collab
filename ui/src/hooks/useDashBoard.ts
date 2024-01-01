import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDocuments } from '../context/DocumentsContext';
import { TextDocument } from '../interfaces';
import { getAuthTokenFromCookie } from '../utils';

export const useDashBoard = () => {
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

  const deleteFile = (documentId: number) => {
    updateDocuments([...documents.filter((d) => d.id !== documentId)]);
  };

  useEffect(() => {
    const isLoggedIn = getAuthTokenFromCookie() ? true : false;
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  return {
    currentContent,
    setCurrentContent,
    documents,
    handleDocumentClick,
    saveNewFile,
    deleteFile,
  };
};
