import { Textarea } from "@/components/ui/textarea";
import EditorHeader from "./edit-header";

const EditorPanel = () => {
  return (
    <div className="flex-1 flex flex-col gap-4 border-[#e5e7eb] border-2 rounded-lg bg-[#fbfbfb] h-[85%]">
      <EditorHeader />
      <Textarea className="h-full" />
    </div>
  );
};

export default EditorPanel;
