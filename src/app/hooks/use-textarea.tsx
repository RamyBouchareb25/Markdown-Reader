import { useContext } from "react";
import { TextAreaContext } from "../Context/textarea-context";

export const useTextArea = () => {
  const textAreaHook = useContext(TextAreaContext);
  if (!textAreaHook)
    throw Error("useTextArea hook must be used with TextAreaProvider");
  return textAreaHook;
};
