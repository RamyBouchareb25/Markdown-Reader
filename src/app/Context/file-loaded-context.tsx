import React, { createContext, useState, ReactNode } from "react";

interface FileLoadedContextProps {
  fileName: string;
  filePath: string;
  setFileName: (fileName: string) => void;
  setFilePath: (filePath: string) => void;
}

const FileLoadedContext = createContext<FileLoadedContextProps | undefined>(
  undefined
);

const FileLoadedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  return (
    <FileLoadedContext.Provider
      value={{ fileName, setFileName, filePath, setFilePath }}
    >
      {children}
    </FileLoadedContext.Provider>
  );
};

export { FileLoadedContext, FileLoadedProvider };
