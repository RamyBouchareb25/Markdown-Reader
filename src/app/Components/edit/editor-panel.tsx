import { Textarea } from "@/components/ui/textarea";
import EditorHeader from "./edit-header";
import { useMarkdown } from "../../hooks/use-markdown";
import { useRef } from "react";
import { sha256 } from "../../lib/utils";
import { useFileLoaded } from "@/app/hooks/use-file-loaded";
import ContextMenuProvider from "../context-menu-provider";
import { useTextArea } from "@/app/hooks/use-textarea";

const EditorPanel = () => {
  const { markdown, setMarkdown } = useMarkdown();
  const timeout = useRef<NodeJS.Timeout>(null);
  const { initialTextHash, setDidFileChange } = useFileLoaded();
  const checkIfDataChanged = async (newMarkdown: string) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      const newHash = await sha256(newMarkdown);
      if (newHash !== initialTextHash) {
        setDidFileChange(true);
      } else {
        setDidFileChange(false);
      }
    }, 1000);
  };
  const { ref } = useTextArea();
  return (
    <div className="flex-1 dark:text-white dark:bg-[#4d4d4d] flex flex-col gap-4 border-[#e5e7eb] border-2 rounded-lg bg-[#fbfbfb] h-full">
      <EditorHeader />
      <ContextMenuProvider>
        <Textarea
          ref={ref}
          className="h-full"
          value={markdown}
          onChange={(e) => {
            setMarkdown(e.target.value);
            checkIfDataChanged(e.target.value);
          }}
        />
      </ContextMenuProvider>
    </div>
  );
};

export default EditorPanel;
