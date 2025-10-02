"use client";

import { Button } from "@/components/ui/Button";

interface Props {
  close?: boolean;
}

export default function ToggleMedicationFormButton({ close = false }: Props) {
  const toggleForm = () => {
    const form = document.getElementById("medication-form");
    if (!form) return;

    if (close) {
      form.classList.add("translate-x-full");
      form.classList.remove("translate-x-0");
    } else {
      form.classList.add("translate-x-0");
      form.classList.remove("translate-x-full");
      const firstInput = form.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("input, textarea, select");
      firstInput?.focus();
    }
  };

  if (close) {
    return (
      <button
        onClick={toggleForm}
        className="text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
    );
  }

  return (
    <Button size="sm" onClick={toggleForm}>
      + Record Medication
    </Button>
  );
}
