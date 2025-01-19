"use client";

import { Button } from "@/components/ui/button";
import { mdiThemeLightDark } from "@mdi/js";
import Icon from "@mdi/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button onClick={toggleTheme} variant="ghost">
      <Icon path={mdiThemeLightDark} size={1} />
    </Button>
  );
}