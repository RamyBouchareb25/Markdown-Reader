import React, { createContext, useState, ReactNode } from "react";

interface TextContextProps {
  text: string;
  setText: (text: string) => void;
}

const TextContext = createContext<TextContextProps | undefined>(
  undefined
);

const TextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [text, setText] = useState<string>("");

  return (
    <TextContext.Provider value={{ text, setText }}>
      {children}
    </TextContext.Provider>
  );
};

export { TextContext, TextProvider };
