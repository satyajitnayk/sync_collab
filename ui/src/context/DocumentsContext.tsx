import { ReactNode, createContext, useContext, useState } from 'react';
import { TextDocument } from '../interfaces';
import { documents as initialDocs } from '../assets';

interface DocumentsContextProps {
  documents: TextDocument[];
  updateDocuments: (updatedDocs: TextDocument[]) => void;
}

const DocumentsContext = createContext<DocumentsContextProps | undefined>(
  undefined
);

export const DocumentsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [documents, setDocuments] = useState<TextDocument[]>(initialDocs);

  const updateDocuments = (updatedDocuments: any[]) => {
    setDocuments(updatedDocuments);
  };

  return (
    <DocumentsContext.Provider value={{ documents, updateDocuments }}>
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocuments = (): DocumentsContextProps => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
};
