// components/ui/Switch.tsx
"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      // unchecked → dark orange, checked → light blue
      "data-[state=unchecked]:bg-orange-400 data-[state=checked]:bg-blue-300",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "relative flex items-center justify-center h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-300",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    >
      {/* Light mode icon */}
      <Sun
        className={cn(
          "absolute h-3.5 w-3.5 text-orange-500 transition-all duration-300",
          "data-[state=unchecked]:opacity-100 data-[state=unchecked]:scale-100",
          "data-[state=checked]:opacity-0 data-[state=checked]:scale-75"
        )}
      />
      {/* Dark mode icon */}
      <Moon
        className={cn(
          "absolute h-3.5 w-3.5 text-blue-400 transition-all duration-300",
          "data-[state=unchecked]:opacity-0 data-[state=unchecked]:scale-75",
          "data-[state=checked]:opacity-100 data-[state=checked]:scale-100"
        )}
      />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
