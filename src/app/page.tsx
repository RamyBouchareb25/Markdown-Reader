"use client";
import { Button } from "@/components/ui/button";
import EditorPanel from "./Components/edit/editor-panel";
import ViewPanel from "./Components/view/view-panel";
import { useFileLoaded } from "./hooks/use-file-loaded";
import { useMarkdown } from "./hooks/use-markdown";
import { useEffect, useState } from "react";
import { saveFile, saveFileAs, sha256 } from "./lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertDialog } from "./hooks/use-alert";

export default function Home() {
  const {
    setFileName,
    setDidFileChange,
    setInitialTextHash,
    setFilePath,
    filePath,
  } = useFileLoaded();
  const { setMarkdown, markdown } = useMarkdown();
  const handleClear = () => {
    setFileName("Untitled");
    setMarkdown("");
  };
  const { didFileChange, fileName } = useFileLoaded();
  const { isSaveAsOpen, isSaveOpen, setIsSaveAsOpen, setIsSaveOpen } =
    useAlertDialog();

  const [loading, setLoading] = useState(false);
  const handleSave = () => {
    setLoading(true);
    saveFile(markdown, filePath);
    sha256(markdown).then((hash) => {
      setDidFileChange(false);
      setInitialTextHash(hash);
      setIsSaveOpen(false);
      setLoading(false);
    });
  };
  const handleSaveAs = () => {
    setLoading(true);
    saveFileAs(markdown).then((data) => {
      sha256(markdown).then((hash) => {
        const { fileName, filePath } = data!;
        setDidFileChange(false);
        setInitialTextHash(hash);
        setFileName(fileName!);
        setFilePath(filePath!);
        setIsSaveAsOpen(false);
        setLoading(false);
      });
    });
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+S or Cmd+S
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        if (!didFileChange) return;
        if (fileName == "Untitled") {
          setIsSaveAsOpen(true);
        } else {
          setIsSaveOpen(true);
        }
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "s" &&
        event.shiftKey
      ) {
        event.preventDefault();
        setIsSaveAsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [didFileChange, fileName, setIsSaveAsOpen, setIsSaveOpen]);

  return (
    <div className="h-[91vh] flex dark:bg-black flex-col gap-4">
      <main className="flex mt-10 h-[80vh] items-center flex-row justify-between gap-4 px-3">
        <EditorPanel />
        <ViewPanel />
        <AlertDialog open={isSaveOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to save?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will save the contents of the file are you sure you want to
                proceed ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={loading}
                onClick={() => setIsSaveOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction disabled={loading} onClick={handleSave}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={isSaveAsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to save the file?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will save the contents of the file in another file, are you
                sure you want to proceed ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={loading}
                onClick={() => setIsSaveAsOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction disabled={loading} onClick={handleSaveAs}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <div className="h-[6vh] flex flex-row justify-end px-4">
        <Button onClick={handleClear}>Clear</Button>
      </div>
    </div>
  );
}
