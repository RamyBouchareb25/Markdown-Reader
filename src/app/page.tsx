"use client";
import { Button } from "@/components/ui/button";
import EditorPanel from "./Components/edit/editor-panel";
import ViewPanel from "./Components/view/view-panel";
import { useFileLoaded } from "./hooks/use-file-loaded";
import { useMarkdown } from "./hooks/use-markdown";

export default function Home() {
  const { setFileName } = useFileLoaded();
  const { setMarkdown } = useMarkdown();
  const handleClear = () => {
    setFileName("Untitled");
    setMarkdown("");
  };
  return (
    <div className="h-[91vh] flex dark:bg-black flex-col gap-4">
      <main className="flex mt-10 h-[80vh] items-center flex-row justify-between gap-4 px-3">
        <EditorPanel />
        <ViewPanel />
      </main>
      <div className="h-[6vh] flex flex-row justify-end px-4">
        <Button onClick={handleClear}>Clear</Button>
      </div>
    </div>
  );
}
