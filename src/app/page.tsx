"use client"
import EditorPanel from "./Components/edit/editor-panel";
import ViewPanel from "./Components/view/view-panel";

export default function Home() {
  return (
    <main className="flex h-[91vh] items-center flex-row justify-between gap-4 px-3">
      <EditorPanel />
      <ViewPanel />
    </main>
  );
}
