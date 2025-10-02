// components/ToggleDutyRosterFormButton.tsx
"use client";

import { Button } from "./ui/Button";

interface Props {
  close?: boolean;
}

export default function ToggleRostersButton({ close = false }: Props) {
  const toggleForm = () => {
    const form = document.getElementById("rosters-form");
    if (!form) return;

    if (close) {
      form.classList.add("translate-x-full");
      form.classList.remove("translate-x-0");
    } else {
      form.classList.add("translate-x-0");
      form.classList.remove("translate-x-full");
      const firstInput = form.querySelector<HTMLInputElement | HTMLSelectElement>("input, select");
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
      + Create Duty Roster
    </Button>
  );
}
