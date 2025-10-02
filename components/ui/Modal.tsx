// components/ui/Modal.tsx
"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background text-foreground rounded-lg shadow-lg max-w-lg w-full p-6 relative transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
        >
          ✕
          <span className="sr-only">Close</span>
        </button>

        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

        {children}
      </div>
    </div>
  );
};
