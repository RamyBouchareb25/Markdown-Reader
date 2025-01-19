import React, { createContext, useState, ReactNode, useEffect } from "react";
import { loadFromFile } from "../lib/utils";
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
  const { setFileName } = useFileLoaded();
  const [markdown, setMarkdown] = useState<string>("");
  const loadMarkdown = async (): Promise<boolean> => {
    const loadedData = await loadFromFile();
    if (!loadedData) return false;
    const { data, fileName } = loadedData;
    setFileName(fileName);
    setMarkdown(data);
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
