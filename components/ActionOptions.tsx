"use client";

import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

export const ActionOptions = ({ children }: { children: React.ReactNode }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="flex items-center justify-center rounded-full p-1">
        <EllipsisVertical size={16} className="text-gray-500 dark:text-gray-400" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-56 p-3 bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark">
      <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark mb-4 uppercase">
        Perform Action
      </span>
      {children}
    </PopoverContent>
  </Popover>
);

const className =
  "flex items-center justify-center rounded-full bg-blue-600/10 dark:bg-blue-500/20 hover:underline text-blue-600 dark:text-blue-400 px-1.5 py-1 text-xs md:text-sm disabled:text-gray-400 dark:disabled:text-gray-500 disabled:hover:no-underline disabled:cursor-not-allowed";

export const ViewAction = ({ href, disabled = false }: { href: string; disabled?: boolean }) => (
  <Link href={href}>
    <button disabled={disabled} className={className}>View</button>
  </Link>
);

export const ViewActionButton = () => (
  <button type="button" className={className}>View</button>
);
