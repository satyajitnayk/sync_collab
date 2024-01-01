import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextEditor from './TextEditor';
import { documents } from '../assets';
import NotFoundPage from './NotFoundPage';
import { TextDocument } from '../interfaces';

export const TextEditorWithContent = () => {
  const [documentInfo, setDocumentInfo] = useState<TextDocument | null>();

  const { documentId } = useParams();

  useEffect(() => {
    const fetchDocumentContent = async () => {
      try {
        const documentInfo = documents.find(
          (document) => document.id === parseInt(documentId ?? '0')
        );
        setDocumentInfo(documentInfo);
      } catch (error) {
        console.error('Error fetching document content:', error);
      }
    };

    fetchDocumentContent();
  }, [documentId]);

  if (!documentInfo) return <NotFoundPage />;

  return (
    documentInfo && (
      <div>
        <h1 style={{ textAlign: 'center' }}>{documentInfo.fileName}</h1>
        <div style={{ display: 'grid', justifyContent: 'center' }}>
          <TextEditor content={documentInfo.content} />
        </div>
      </div>
    )
  );
};
