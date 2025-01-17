import React, { createContext, useState, ReactNode, useEffect } from "react";
import { loadFromFile, transformMarkdownToText } from "../lib/utils";
import { useText } from "../hooks/use-text";

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
  const [markdown, setMarkdown] = useState<string>("");
  const loadMarkdown = async (): Promise<boolean> => {
    const data = await loadFromFile();
    if (!data) return false;
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
