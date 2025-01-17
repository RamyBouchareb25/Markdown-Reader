import { useContext } from "react";
import { TextContext } from "../Context/text-context";

export const useText = () => {
  const text = useContext(TextContext);
  if (!text) {
    throw new Error("useText must be used within a TextProvider");
  }
  return text;
};
