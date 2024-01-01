import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextEditor from './TextEditor';
import NotFoundPage from './NotFoundPage';
import { TextDocument } from '../interfaces';
import { useDocuments } from '../context/DocumentsContext';

export const TextEditorWithContent = () => {
  const { documents, updateDocuments } = useDocuments();
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

  const saveDocument = () => {
    if (!documentInfo || documentInfo.content === undefined) {
      console.error('Invalid documentInfo or content');
      return;
    }
    const updatedDocs = documents.map((doc) =>
      doc.id === parseInt(documentId ?? '0')
        ? { ...doc, content: documentInfo.content }
        : doc
    );

    updateDocuments(updatedDocs);
  };

  if (!documentInfo) return <NotFoundPage />;

  return (
    documentInfo && (
      <div>
        <h1 style={{ textAlign: 'center' }}>{documentInfo.fileName}</h1>
        <button onClick={saveDocument}>save</button>
        <div style={{ display: 'grid', justifyContent: 'center' }}>
          <TextEditor
            content={documentInfo.content}
            onContentChange={(newContent) =>
              setDocumentInfo((prev) =>
                prev ? { ...prev, content: newContent } : prev
              )
            }
          />
        </div>
      </div>
    )
  );
};
