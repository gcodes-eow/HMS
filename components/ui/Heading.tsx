import * as React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({ as: Tag = "h3", className, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn(
        "text-foreground font-semibold",
        Tag === "h1" && "text-3xl",
        Tag === "h2" && "text-2xl",
        Tag === "h3" && "text-lg",
        Tag === "h4" && "text-base",
        className
      )}
      {...props}
    />
  );
}
