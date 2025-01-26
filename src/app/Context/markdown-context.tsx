import React, { createContext, useState, ReactNode, useEffect } from "react";
import { loadFromFile, sha256 } from "../lib/utils";
import { useText } from "../hooks/use-text";
import { useFileLoaded } from "../hooks/use-file-loaded";
import { transformMarkdownToText } from "../lib/markdown-processing";

interface MarkdownContextProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  loadMarkdown: () => Promise<boolean>;
}

const MarkdownContext = createContext<MarkdownContextProps | undefined>(
  undefined
);

const MarkdownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setText } = useText();
  const { setFileName, setFilePath, setInitialTextHash } = useFileLoaded();
  const [markdown, setMarkdown] = useState<string>("");
  const loadMarkdown = async (): Promise<boolean> => {
    const loadedData = await loadFromFile();
    if (!loadedData) return false;
    const { data, fileName, path } = loadedData;
    const hash = await sha256(data);
    setFileName(fileName);
    setFilePath(path);
    setMarkdown(data);
    setInitialTextHash(hash);
    return true;
  };
  useEffect(() => {
    setText(transformMarkdownToText(markdown));
  }, [markdown, setText]);
  return (
    <MarkdownContext.Provider value={{ markdown, setMarkdown, loadMarkdown }}>
      {children}
    </MarkdownContext.Provider>
  );
};

export { MarkdownContext, MarkdownProvider };
