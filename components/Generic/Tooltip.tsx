"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
};

export default function Tooltip({
  children,
  content,
  side = "right",
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className="z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95"
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-slate-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
