import React, { createContext, useState, ReactNode } from "react";

interface FileLoadedContextProps {
  fileName: string;
  setFileName: (fileName: string) => void;
}

const FileLoadedContext = createContext<FileLoadedContextProps | undefined>(
  undefined
);

const FileLoadedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fileName, setFileName] = useState<string>("");


  return (
    <FileLoadedContext.Provider value={{ fileName, setFileName }}>
      {children}
    </FileLoadedContext.Provider>
  );
};

export { FileLoadedContext, FileLoadedProvider };
