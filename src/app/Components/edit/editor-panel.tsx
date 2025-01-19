import { Textarea } from "@/components/ui/textarea";
import EditorHeader from "./edit-header";
import { useMarkdown } from "../../hooks/use-markdown";

const EditorPanel = () => {
  const { markdown, setMarkdown } = useMarkdown();
  return (
    <div className="flex-1 dark:text-white dark:bg-[#4d4d4d] flex flex-col gap-4 border-[#e5e7eb] border-2 rounded-lg bg-[#fbfbfb] h-full">
      <EditorHeader />
      <Textarea
        className="h-full"
        value={markdown}
        onChange={(e) => {
          setMarkdown(e.target.value);
        }}
      />
    </div>
  );
};

export default EditorPanel;
