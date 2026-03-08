"use client";

interface Props {
  selectedCell: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FormulaBar({ selectedCell, value, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <div className="w-16 border bg-gray-100 flex items-center justify-center font-semibold">
        {selectedCell}
      </div>
      <input
        className="flex-1 border p-2 rounded focus:outline-none focus:border-blue-400"
        placeholder="Enter value or formula"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}