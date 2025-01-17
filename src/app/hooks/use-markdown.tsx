import { useContext } from "react";
import { MarkdownContext } from "../Context/markdown-context";

export const useMarkdown = () => {
  const markdown = useContext(MarkdownContext);
  if (!markdown) {
    throw new Error("useMarkdown must be used within a MarkdownProvider");
  }
  return markdown;
};
