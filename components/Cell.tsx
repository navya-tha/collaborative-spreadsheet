"use client";
import { useState, useEffect } from "react";

interface CellProps {
  value: string;
  displayValue: string;
  onChange: (v: string) => void;
  keyLabel: string;
}

export default function Cell({ value, displayValue, onChange, keyLabel }: CellProps) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value || "");

  useEffect(() => setLocal(value || ""), [value]);

  return (
    <input
      className="border border-gray-300 w-full h-10 text-center outline-none text-sm hover:bg-blue-50 focus:bg-blue-100"
      value={editing ? local : displayValue || local || ""}
      placeholder={keyLabel}
      onFocus={() => setEditing(true)}
      onBlur={() => {
        setEditing(false);
        onChange(local);
      }}
      onChange={(e) => setLocal(e.target.value)}
    />
  );
}