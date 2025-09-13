// components/laboratory/ToggleLabFormButton.tsx
"use client";

import { Button } from "@/components/ui/Button";

interface ToggleLabFormButtonProps {
  close?: boolean;
}

export default function ToggleLabFormButton({ close = false }: ToggleLabFormButtonProps) {
  const toggleForm = () => {
    const form = document.getElementById("lab-form");
    if (!form) return;

    if (close) {
      // Slide out
      form.classList.add("translate-x-full");
      form.classList.remove("translate-x-0");
    } else {
      // Slide in
      form.classList.add("translate-x-0");
      form.classList.remove("translate-x-full");

      // Focus first input
      const firstInput = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input, textarea, select"
      );
      firstInput?.focus();
    }
  };

  if (close) {
    return (
      <button onClick={toggleForm} className="text-gray-500 hover:text-gray-700">
        ✕
      </button>
    );
  }

  return (
    <Button size="sm" onClick={toggleForm}>
      + Add Lab Test
    </Button>
  );
}
