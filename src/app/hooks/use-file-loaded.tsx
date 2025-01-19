import { useContext } from "react";
import { FileLoadedContext } from "../Context/file-loaded-context";

export const useFileLoaded = () => {
  const fileLoadedContext = useContext(FileLoadedContext);
  if (!fileLoadedContext) {
    throw new Error("useFileLoaded must be used within a FileLoadedProvider");
  }
  return fileLoadedContext;
};
