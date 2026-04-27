"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div onClick={toggleTheme} className="hover:text-black/70">
      <Sun className="h-[1.4rem] w-[1.4rem] cursor-pointer scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.4rem] w-[1.4rem] cursor-pointer -translate-y-6 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </div>
  );
}
