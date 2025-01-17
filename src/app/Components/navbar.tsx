"use client";
import { Button } from "@/components/ui/button";
import Icon from "./icon";
import { Icon as MdiIcon } from "@mdi/react";
import { mdiThemeLightDark } from "@mdi/js";
import Link from "next/link";
import { useMarkdown } from "../hooks/use-markdown";
const NavBar = () => {
  const { loadMarkdown } = useMarkdown();

  const handleLoad = () => {
    loadMarkdown().then((res) => {
      if (!res) {
        alert("Failed to load file");
      }
    });
  };
  return (
    <nav className="flex flex-row justify-between items-center px-2 w-full min-h-[9vh] h-[9vh] shadow-xl">
      <Link href="/">
        <Icon />
      </Link>
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
          <Button>Save As</Button>
        </li>
        <li>
          <Button>Save</Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
