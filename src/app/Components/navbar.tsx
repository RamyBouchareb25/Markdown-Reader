"use client";
import { Button } from "@/components/ui/button";
import Icon from "./icon";
import Link from "next/link";
import { useMarkdown } from "../hooks/use-markdown";
import { useFileLoaded } from "../hooks/use-file-loaded";
import { useEffect } from "react";
import { saveFile, saveFileAs, sha256 } from "../lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
const NavBar = () => {
  const { loadMarkdown, markdown } = useMarkdown();
  const {
    setInitialTextHash,
    fileName,
    setFileName,
    filePath,
    setFilePath,
    didFileChange,
    setDidFileChange,
  } = useFileLoaded();
  const handleSaveAs = () => {
    saveFileAs(markdown).then((data) => {
      sha256(markdown).then((hash) => {
        const { fileName, filePath } = data!;
        setDidFileChange(false);
        setInitialTextHash(hash);
        setFileName(fileName!);
        setFilePath(filePath!);
      });
    });
  };
  const handleSaveFile = () => {
    saveFile(markdown, filePath);
    sha256(markdown).then((hash) => {
      setDidFileChange(false);
      setInitialTextHash(hash);
    });
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
      setFilePath("");
    }
  }, [fileName, setFileName, setFilePath]);
  return (
    <nav className="flex relative z-10 flex-row justify-between items-center px-2 w-full min-h-[9vh] h-[9vh] shadow-xl dark:bg-black  dark:shadow-[rgba(230,230,230,0.2)]">
      <Link href="/">
        <Icon />
      </Link>
      <h1 className={`text-xl ${didFileChange && "font-bold"}`}>
        {fileName} {didFileChange && "*"}
      </h1>
      <ul className="flex flex-row gap-2 items-center">
        <li>
          <ThemeSwitcher />
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
          <Button onClick={handleSaveFile} disabled={fileName === "Untitled"}>
            Save
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
