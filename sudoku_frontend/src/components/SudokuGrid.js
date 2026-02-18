import React from "react";
import "./SudokuGrid.css";

function clampDigit(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n < 1 || n > 9) return 0;
  return n;
}

// PUBLIC_INTERFACE
export default function SudokuGrid({
  grid,
  fixed,
  conflicts,
  selected,
  onSelect,
  onChangeCell,
}) {
  /**
   * Renders the 9x9 Sudoku grid and handles user interactions.
   *
   * Props:
   * - grid: number[9][9]
   * - fixed: boolean[9][9] (true for given cells)
   * - conflicts: boolean[9][9] (true for conflicting cells)
   * - selected: { r: number, c: number } | null
   * - onSelect(r,c): callback when a cell is selected
   * - onChangeCell(r,c,val): callback to update a cell (val 0..9)
   */
  return (
    <div className="sudokuGrid" role="grid" aria-label="Sudoku grid">
      {grid.map((row, r) =>
        row.map((val, c) => {
          const isFixed = fixed?.[r]?.[c] ?? false;
          const isSelected = selected?.r === r && selected?.c === c;
          const isConflict = conflicts?.[r]?.[c] ?? false;

          const inSameRow = selected && selected.r === r;
          const inSameCol = selected && selected.c === c;
          const inSameBox =
            selected &&
            Math.floor(selected.r / 3) === Math.floor(r / 3) &&
            Math.floor(selected.c / 3) === Math.floor(c / 3);

          const classes = [
            "cell",
            isFixed ? "fixed" : "editable",
            isSelected ? "selected" : "",
            !isSelected && (inSameRow || inSameCol || inSameBox) ? "related" : "",
            isConflict ? "conflict" : "",
            r % 3 === 0 ? "thickTop" : "",
            c % 3 === 0 ? "thickLeft" : "",
            r === 8 ? "thickBottom" : "",
            c === 8 ? "thickRight" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const display = val === 0 ? "" : String(val);

          return (
            <div
              key={`${r}-${c}`}
              className={classes}
              role="gridcell"
              aria-label={`Row ${r + 1} Column ${c + 1}`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect?.(r, c)}
              onKeyDown={(e) => {
                if (isFixed) return;

                if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
                  e.preventDefault();
                  onChangeCell?.(r, c, 0);
                  return;
                }

                if (e.key >= "1" && e.key <= "9") {
                  e.preventDefault();
                  onChangeCell?.(r, c, clampDigit(e.key));
                  return;
                }

                // Arrow navigation
                if (!selected) return;
                const moves = {
                  ArrowUp: [-1, 0],
                  ArrowDown: [1, 0],
                  ArrowLeft: [0, -1],
                  ArrowRight: [0, 1],
                };
                if (moves[e.key]) {
                  e.preventDefault();
                  const [dr, dc] = moves[e.key];
                  const nr = Math.max(0, Math.min(8, selected.r + dr));
                  const nc = Math.max(0, Math.min(8, selected.c + dc));
                  onSelect?.(nr, nc);
                }
              }}
            >
              {isFixed ? (
                <span className="cellText fixedText">{display}</span>
              ) : (
                <input
                  className="cellInput"
                  inputMode="numeric"
                  pattern="[1-9]*"
                  value={display}
                  disabled={isFixed}
                  aria-label={`Cell ${r + 1},${c + 1}`}
                  onFocus={() => onSelect?.(r, c)}
                  onChange={(e) => {
                    const next = e.target.value;
                    // allow empty
                    if (next === "") {
                      onChangeCell?.(r, c, 0);
                      return;
                    }
                    // keep last char if user pastes more
                    const lastChar = next[next.length - 1];
                    const digit = clampDigit(lastChar);
                    onChangeCell?.(r, c, digit);
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
