import React, { createContext, useState, ReactNode } from "react";
import { loadFromFile } from "../lib/utils";

interface MarkdownContextProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  loadMarkdown: () => Promise<boolean>;
}

const MarkdownContext = createContext<MarkdownContextProps | undefined>(
  undefined
);

const MarkdownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markdown, setMarkdown] = useState<string>("");
  const loadMarkdown = async (): Promise<boolean> => {
    const data = await loadFromFile();
    if (!data) return false;
    setMarkdown(data);
    return true;
  };
  return (
    <MarkdownContext.Provider value={{ markdown, setMarkdown, loadMarkdown }}>
      {children}
    </MarkdownContext.Provider>
  );
};

export { MarkdownContext, MarkdownProvider };
