"use client";
import { Button } from "@/components/ui/button";
import Icon from "./icon";
import { Icon as MdiIcon } from "@mdi/react";
import { mdiThemeLightDark } from "@mdi/js";
import Link from "next/link";
import { useMarkdown } from "../hooks/use-markdown";
import { useFileLoaded } from "../hooks/use-file-loaded";
import { useEffect } from "react";
import { saveFileAs } from "../lib/utils";
const NavBar = () => {
  const { loadMarkdown, markdown } = useMarkdown();
  const { fileName, setFileName } = useFileLoaded();
  const handleSaveAs = () => {
    saveFileAs(markdown);
  };
  const handleLoad = () => {
    loadMarkdown().then((res) => {
      if (!res) {
        alert("Failed to load file");
      }
    });
  };
  useEffect(() => {
    if (!fileName || fileName === "") {
      setFileName("Untitled");
    }
  }, [fileName, setFileName]);
  return (
    <nav className="flex flex-row justify-between items-center px-2 w-full min-h-[9vh] h-[9vh] shadow-xl">
      <Link href="/">
        <Icon />
      </Link>
      <h1 className="text-xl font-bold">{fileName}</h1>
      <ul className="flex flex-row gap-2 items-center">
        <li>
          <Button variant="ghost">
            <MdiIcon path={mdiThemeLightDark} size={1} />
          </Button>
        </li>
        <li>
          <Button onClick={handleLoad}>Load From File</Button>
        </li>
        <li>
          <Button onClick={handleSaveAs} disabled={!markdown || markdown == ""}>
            Save As
          </Button>
        </li>
        <li>
          <Button disabled={fileName === "Untitled"}>Save</Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
