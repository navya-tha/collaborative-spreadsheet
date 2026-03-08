// components/SpreadsheetGrid.tsx
"use client";
import { useState } from "react";
import Cell from "./Cell";
import { useDocument } from "@/hooks/useDocument";
import { evaluateFormula } from "@/utils/formula";
import { useAuth } from "@/hooks/useAuth";
import { usePresence } from "@/hooks/usePresence";

const ROWS = 20;
const COLS = 10;

function columnLetter(index: number) {
  return String.fromCharCode(65 + index);
}

export default function SpreadsheetGrid({ documentId }: { documentId: string }) {
  const { cells, updateCell, saving, loaded } = useDocument(documentId);
  const { user } = useAuth();
  const [selectedCell, setSelectedCell] = useState("A1");
  const [formula, setFormula] = useState(cells[selectedCell] || "");

  const activeUsers = usePresence(documentId, user);

  if (!loaded) return <div className="mt-10 text-gray-500">Loading spreadsheet...</div>;

  // ✅ Define handleFormulaChange here
  function handleFormulaChange(value: string) {
    updateCell(selectedCell, value);
    setFormula(value);
  }

  return (
    <div className="flex flex-col items-center mt-6">
      {/* Active Users */}
      {activeUsers.length > 0 && (
        <div className="flex gap-3 mb-4 overflow-x-auto w-full max-w-[1100px]">
          {activeUsers.map((u) => (
            <div key={u.uid} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm">{u.displayName}</span>
            </div>
          ))}
        </div>
      )}

      {/* Formula Bar */}
      <div className="mb-2 w-full max-w-[1100px]">
        <div className="flex gap-2 mb-1">
          <div className="w-16 border bg-gray-100 flex items-center justify-center font-semibold">
            {selectedCell}
          </div>
          <input
            className="flex-1 border p-2 rounded focus:outline-none focus:border-blue-400"
            placeholder="Enter value or formula"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFormulaChange(formula);
            }}
          />
        </div>
        <div className="text-sm text-gray-500">{saving ? "Saving..." : "Saved ✓"}</div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="overflow-auto border border-gray-300 inline-block">
        {/* Column headers */}
        <div className="grid bg-gray-100" style={{ gridTemplateColumns: `60px repeat(${COLS}, 100px)` }}>
          <div className="border border-gray-300"></div>
          {Array.from({ length: COLS }).map((_, c) => (
            <div key={c} className="border border-gray-300 h-10 flex items-center justify-center font-semibold">
              {columnLetter(c)}
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: ROWS }).map((_, r) => (
          <div key={r} className="grid" style={{ gridTemplateColumns: `60px repeat(${COLS}, 100px)` }}>
            <div className="border border-gray-300 h-10 flex items-center justify-center bg-gray-100 font-semibold">
              {r + 1}
            </div>
            {Array.from({ length: COLS }).map((_, c) => {
              const key = `${columnLetter(c)}${r + 1}`;
              const displayValue = evaluateFormula(cells[key], cells);

              return (
                <Cell
                  key={key}
                  value={cells[key] || ""}
                  displayValue={displayValue}
                  onChange={(v) => {
                    updateCell(key, v);
                    setSelectedCell(key);
                    setFormula(v);
                  }}
                  keyLabel={key}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}