"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TextProvider } from "./Context/text-context";
import { MarkdownProvider } from "./Context/markdown-context";
import { FileLoadedProvider } from "./Context/file-loaded-context";
import { useEffect, useState } from "react";
import LoadingComponent from "./Components/loading";
import { TextAreaProvider } from "./Context/textarea-context";
import { AlertDialogueProvider } from "./Context/alert-dialogue-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingComponent />; // Render children without ThemeProvider during SSR

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <FileLoadedProvider>
        <TextProvider>
          <MarkdownProvider>
            <TextAreaProvider>
              <AlertDialogueProvider>{children}</AlertDialogueProvider>
            </TextAreaProvider>
          </MarkdownProvider>
        </TextProvider>
      </FileLoadedProvider>
    </NextThemesProvider>
  );
}
