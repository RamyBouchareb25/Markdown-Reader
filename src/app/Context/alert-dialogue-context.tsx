import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
  } from "react";
  
  type AlertContextProps = {
    setIsSaveOpen: Dispatch<SetStateAction<boolean>>;
    setIsSaveAsOpen: Dispatch<SetStateAction<boolean>>;
    isSaveOpen: boolean;
    isSaveAsOpen: boolean;
  };
  
  export const AlertContext = createContext<AlertContextProps | null>(null);
  export const AlertDialogueProvider = ({ children }: { children: ReactNode }) => {
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
    return (
      <AlertContext.Provider
        value={{ setIsSaveAsOpen, isSaveAsOpen, isSaveOpen, setIsSaveOpen }}
      >
        {children}
      </AlertContext.Provider>
    );
  };