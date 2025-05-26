"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  className?: string;
}

export function Toast({ message, onClose, className }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50",
        className
      )}
    >
      <span>{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
