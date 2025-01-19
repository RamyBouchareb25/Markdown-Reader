import React, { createContext, useState, ReactNode } from "react";

interface TextContextProps {
  text: (string | React.JSX.Element)[];
  setText: (text: (string | React.JSX.Element)[]) => void;
}

const TextContext = createContext<TextContextProps | undefined>(undefined);

const TextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [text, setText] = useState<(string | React.JSX.Element)[]>([]);

  return (
    <TextContext.Provider value={{ text, setText }}>
      {children}
    </TextContext.Provider>
  );
};

export { TextContext, TextProvider };
