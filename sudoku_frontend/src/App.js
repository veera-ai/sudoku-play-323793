import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import SudokuGrid from "./components/SudokuGrid";
import { applyCellValue, generateSudokuPuzzle, validateGrid } from "./utils/sudoku";

function clone2D(arr) {
  return arr.map((r) => r.slice());
}

function isGridComplete(grid) {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (grid[r][c] === 0) return false;
    }
  }
  return true;
}

// PUBLIC_INTERFACE
function App() {
  /** Main Sudoku app: generates puzzles, handles play/check/reset/new puzzle. */
  const [difficulty, setDifficulty] = useState("easy");

  const [puzzle, setPuzzle] = useState(() => generateSudokuPuzzle({ difficulty }));
  const [grid, setGrid] = useState(() => clone2D(puzzle.puzzle));
  const [selected, setSelected] = useState({ r: 0, c: 0 });
  const [conflicts, setConflicts] = useState(() => validateGrid(grid).conflicts);

  const [status, setStatus] = useState({
    kind: "idle", // idle | checking | solved | error
    message: "Fill the grid, then press Check.",
  });

  const fixed = useMemo(() => puzzle.fixed, [puzzle]);

  useEffect(() => {
    // Recompute conflicts when grid changes (lightweight)
    const { conflicts: nextConflicts, solved } = validateGrid(grid);
    setConflicts(nextConflicts);

    if (solved) {
      setStatus({ kind: "solved", message: "Solved! Nice work." });
    } else if (status.kind === "solved") {
      setStatus({ kind: "idle", message: "Fill the grid, then press Check." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  function newPuzzle(nextDifficulty = difficulty) {
    const nextPuzzle = generateSudokuPuzzle({ difficulty: nextDifficulty });
    setPuzzle(nextPuzzle);
    setGrid(clone2D(nextPuzzle.puzzle));
    setSelected({ r: 0, c: 0 });
    setStatus({ kind: "idle", message: "New puzzle generated." });
  }

  function resetPuzzle() {
    setGrid(clone2D(puzzle.puzzle));
    setStatus({ kind: "idle", message: "Puzzle reset." });
  }

  function checkPuzzle() {
    const { conflicts: nextConflicts, solved } = validateGrid(grid);
    setConflicts(nextConflicts);

    if (solved) {
      setStatus({ kind: "solved", message: "Solved! Nice work." });
      return;
    }

    const hasAnyConflict = nextConflicts.some((row) => row.some(Boolean));
    if (hasAnyConflict) {
      setStatus({ kind: "error", message: "There are conflicts. Fix highlighted cells." });
      return;
    }

    if (!isGridComplete(grid)) {
      setStatus({ kind: "idle", message: "So far so good—keep going." });
      return;
    }

    // Complete but not solved (should be rare if no conflicts, but guard anyway)
    setStatus({ kind: "error", message: "Grid is complete but incorrect." });
  }

  function handleChangeCell(r, c, val) {
    if (fixed?.[r]?.[c]) return;
    setGrid((prev) => applyCellValue(prev, r, c, val));
  }

  return (
    <div className="appRoot">
      <div className="appShell">
        <header className="topBar">
          <div className="brand">
            <div className="brandMark" aria-hidden="true" />
            <div className="brandText">
              <h1 className="title">Sudoku</h1>
              <p className="subtitle">Modern light theme • play & check</p>
            </div>
          </div>

          <div className="controls">
            <label className="selectWrap">
              <span className="selectLabel">Difficulty</span>
              <select
                className="select"
                value={difficulty}
                onChange={(e) => {
                  const next = e.target.value;
                  setDifficulty(next);
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <button className="btn btnSecondary" type="button" onClick={resetPuzzle}>
              Reset
            </button>
            <button className="btn btnPrimary" type="button" onClick={checkPuzzle}>
              Check
            </button>
            <button
              className="btn btnGhost"
              type="button"
              onClick={() => newPuzzle(difficulty)}
            >
              New
            </button>
          </div>
        </header>

        <main className="content">
          <div className="boardCard">
            <SudokuGrid
              grid={grid}
              fixed={fixed}
              conflicts={conflicts}
              selected={selected}
              onSelect={(r, c) => setSelected({ r, c })}
              onChangeCell={handleChangeCell}
            />
            <div
              className={`status ${status.kind}`}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {status.message}
            </div>
          </div>

          <section className="help">
            <h2 className="helpTitle">How to play</h2>
            <ul className="helpList">
              <li>Click a cell and type 1–9 (Backspace/Delete clears).</li>
              <li>Use arrow keys to move around the grid.</li>
              <li>
                Press <strong>Check</strong> anytime—conflicts will be highlighted.
              </li>
              <li>
                Press <strong>Reset</strong> to revert to the original puzzle or{" "}
                <strong>New</strong> for a fresh one.
              </li>
            </ul>

            <button
              className="btn btnLink"
              type="button"
              onClick={() => newPuzzle(difficulty)}
            >
              Generate a new puzzle
            </button>
          </section>
        </main>

        <footer className="footer">
          <span>
            Accents: <span className="swatch swatchBlue" /> #3b82f6{" "}
            <span className="swatch swatchCyan" /> #06b6d4
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
