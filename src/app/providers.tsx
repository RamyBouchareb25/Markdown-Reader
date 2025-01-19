"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TextProvider } from "./Context/text-context";
import { MarkdownProvider } from "./Context/markdown-context";
import { FileLoadedProvider } from "./Context/file-loaded-context";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <FileLoadedProvider>
        <TextProvider>
          <MarkdownProvider>{children}</MarkdownProvider>
        </TextProvider>
      </FileLoadedProvider>
    ); // Render children without ThemeProvider during SSR
  }
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <FileLoadedProvider>
        <TextProvider>
          <MarkdownProvider>{children}</MarkdownProvider>
        </TextProvider>
      </FileLoadedProvider>
    </NextThemesProvider>
  );
}
