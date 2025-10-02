// components/Navbar.tsx
"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Switch } from "./ui/Switch";

export const Navbar = () => {
  const user = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    }
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  }

  function formatPathName(): string {
    const pathname = usePathname();
    if (!pathname) return "Overview";
    const splitRoute = pathname.split("/");
    const lastIndex = splitRoute.length - 1 > 2 ? 2 : splitRoute.length - 1;
    return splitRoute[lastIndex].replace(/-/g, " ");
  }

  const path = formatPathName();

  return (
    <div className="p-5 flex justify-between items-center bg-card shadow-sm">
      <h1 className="text-xl font-medium text-card-foreground capitalize">{path || "Overview"}</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell />
          <p className="absolute -top-3 right-1 size-4 bg-red-600 text-white rounded-full text-[10px] text-center">2</p>
        </div>

        {mounted && <Switch checked={isDark} onCheckedChange={toggleTheme} />}

        {mounted && user?.userId && <UserButton />}
      </div>
    </div>
  );
};
