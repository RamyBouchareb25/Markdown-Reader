import { createContext, ReactNode, RefObject, useRef } from "react";
import { useMarkdown } from "../hooks/use-markdown";

type TextAreaContextProps = {
  ref: RefObject<HTMLTextAreaElement | null>;
  setItalic: () => void;
  setBold: () => void;
  setHeader: (level: number) => void;
};

export const TextAreaContext = createContext<TextAreaContextProps | undefined>(
  undefined
);

export const TextAreaProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { setMarkdown } = useMarkdown();
  const setHeader = (level: number) => {
    const textarea = ref.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const text = textarea.value;
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const beforeLine = text.substring(0, lineStart);
      const afterLine = text.substring(lineStart);
      const header = "#".repeat(level) + " ";
      const newText = `${beforeLine}${header}${afterLine}`;
      textarea.value = newText;
      setMarkdown(newText);
      const newCursorPosition = lineStart + header.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }
  };
  const setBold = () => {
    const textarea = ref.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const selected = text.substring(start, end);
      const newText = `${before}**${selected}**${after}`;
      textarea.value = newText;
      setMarkdown(newText);
      textarea.focus();
      textarea.setSelectionRange(end + 2, end + 2); // Adjust selection to account for added asterisks
    }
  };

  const setItalic = () => {
    const textarea = ref.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const selected = text.substring(start, end);
      const newText = `${before}*${selected}*${after}`;
      textarea.value = newText;
      setMarkdown(newText);
      textarea.focus();
      textarea.setSelectionRange(end + 1, end + 1);
    }
  };
  return (
    <TextAreaContext.Provider value={{ ref, setItalic, setBold, setHeader }}>
      {children}
    </TextAreaContext.Provider>
  );
};
