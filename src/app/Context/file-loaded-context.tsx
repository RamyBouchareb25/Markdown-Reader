import React, { createContext, ReactNode, useState } from "react";

interface FileLoadedContextProps {
  fileName: string;
  filePath: string;
  initialTextHash: string;
  setFileName: (fileName: string) => void;
  setFilePath: (filePath: string) => void;
  setInitialTextHash: (initialText: string) => void;
  didFileChange: boolean;
  setDidFileChange: (didFileChange: boolean) => void;
}

const FileLoadedContext = createContext<FileLoadedContextProps | undefined>(
  undefined
);

const FileLoadedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [didFileChange, setDidFileChange] = useState<boolean>(false);
  const [initialTextHash, setInitialTextHash] = useState("");
  return (
    <FileLoadedContext.Provider
      value={{
        fileName,
        setFileName,
        filePath,
        setFilePath,
        initialTextHash,
        setInitialTextHash,
        didFileChange,
        setDidFileChange,
      }}
    >
      {children}
    </FileLoadedContext.Provider>
  );
};

export { FileLoadedContext, FileLoadedProvider };
