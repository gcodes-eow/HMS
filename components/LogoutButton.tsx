// components/LogoutButton.tsx
"use client";

import React from "react";
import { Button } from "./ui/Button";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export const LogoutButton = () => {
  const { signOut } = useClerk();
  return (
    <Button
      variant={"outline"}
      className="w-fit bottom-0 gap-2 px-0 md:px-4 text-foreground dark:text-foreground-dark"
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
    >
      <LogOut />
      <span className="hidden lg:block">Logout</span>
    </Button>
  );
};
