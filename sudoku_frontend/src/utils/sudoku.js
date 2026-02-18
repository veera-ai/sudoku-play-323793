const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Returns a deep copy of a 9x9 grid.
 */
function cloneGrid(grid) {
  return grid.map((row) => row.slice());
}

/**
 * Fisher–Yates shuffle (non-crypto).
 */
function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function boxIndex(r, c) {
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

function isValidPlacement(grid, r, c, val) {
  // row / col
  for (let i = 0; i < 9; i += 1) {
    if (i !== c && grid[r][i] === val) return false;
    if (i !== r && grid[i][c] === val) return false;
  }
  // box
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let rr = br; rr < br + 3; rr += 1) {
    for (let cc = bc; cc < bc + 3; cc += 1) {
      if ((rr !== r || cc !== c) && grid[rr][cc] === val) return false;
    }
  }
  return true;
}

function findEmptyCell(grid) {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

function computeCandidates(grid, r, c) {
  if (grid[r][c] !== 0) return [];
  const used = new Set();
  for (let i = 0; i < 9; i += 1) {
    if (grid[r][i] !== 0) used.add(grid[r][i]);
    if (grid[i][c] !== 0) used.add(grid[i][c]);
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let rr = br; rr < br + 3; rr += 1) {
    for (let cc = bc; cc < bc + 3; cc += 1) {
      if (grid[rr][cc] !== 0) used.add(grid[rr][cc]);
    }
  }
  return DIGITS.filter((d) => !used.has(d));
}

/**
 * Heuristic: pick the next empty cell with the fewest candidates (MRV).
 */
function pickNextCellMRV(grid) {
  let best = null;
  let bestCandidates = null;

  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (grid[r][c] !== 0) continue;
      const candidates = computeCandidates(grid, r, c);
      if (candidates.length === 0) return { cell: [r, c], candidates: [] };
      if (!best || candidates.length < bestCandidates.length) {
        best = [r, c];
        bestCandidates = candidates;
        if (bestCandidates.length === 1) {
          return { cell: best, candidates: bestCandidates };
        }
      }
    }
  }

  if (!best) return null;
  return { cell: best, candidates: bestCandidates };
}

/**
 * Backtracking solver. Mutates grid in-place.
 * If countSolutionsLimit is provided, counts solutions up to that limit.
 */
function solveGrid(grid, rng = Math.random, countSolutionsLimit = 1) {
  let solutions = 0;

  function backtrack() {
    if (solutions >= countSolutionsLimit) return;

    const next = pickNextCellMRV(grid);
    if (!next) {
      solutions += 1;
      return;
    }

    const { cell, candidates } = next;
    const [r, c] = cell;

    if (candidates.length === 0) return;

    const ordered = shuffle(candidates, rng);
    for (const val of ordered) {
      if (!isValidPlacement(grid, r, c, val)) continue;
      grid[r][c] = val;
      backtrack();
      if (solutions >= countSolutionsLimit) return;
      grid[r][c] = 0;
    }
  }

  backtrack();
  return solutions;
}

/**
 * Creates a complete solved Sudoku grid.
 */
function generateSolvedGrid(rng = Math.random) {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  // Fill via randomized solve
  solveGrid(grid, rng, 1);
  return grid;
}

/**
 * Counts the number of solutions of a grid up to limit (default 2).
 */
function countSolutions(grid, limit = 2) {
  const copy = cloneGrid(grid);
  return solveGrid(copy, Math.random, limit);
}

/**
 * Removes numbers from a solved grid while maintaining unique solution.
 * difficulty: "easy" | "medium" | "hard"
 */
function makePuzzleFromSolution(solution, difficulty = "easy", rng = Math.random) {
  const puzzle = cloneGrid(solution);

  const cluesByDifficulty = {
    easy: 40, // 81-40 = 41 removals
    medium: 32,
    hard: 26,
  };

  const minClues = cluesByDifficulty[difficulty] ?? cluesByDifficulty.easy;
  const cells = [];
  for (let r = 0; r < 9; r += 1) for (let c = 0; c < 9; c += 1) cells.push([r, c]);
  const removalOrder = shuffle(cells, rng);

  let clues = 81;

  for (const [r, c] of removalOrder) {
    if (clues <= minClues) break;

    const backup = puzzle[r][c];
    if (backup === 0) continue;

    // Optional symmetry removal could go here; keep it simple.
    puzzle[r][c] = 0;

    // Ensure uniqueness (<=2 for quick check)
    const solCount = countSolutions(puzzle, 2);
    if (solCount !== 1) {
      puzzle[r][c] = backup; // revert
    } else {
      clues -= 1;
    }
  }

  return puzzle;
}

/**
 * Determines if placing val at (r,c) violates Sudoku rules considering current grid.
 * Treats 0/empty as allowed.
 */
function isMoveLegal(grid, r, c, val) {
  if (val === 0) return true;
  if (val < 1 || val > 9) return false;
  return isValidPlacement(grid, r, c, val);
}

/**
 * Computes a conflict map for a grid: conflicts[r][c] = true if cell violates rules.
 */
function computeConflicts(grid) {
  const conflicts = Array.from({ length: 9 }, () => Array(9).fill(false));

  // Mark duplicates in rows/cols/boxes
  for (let r = 0; r < 9; r += 1) {
    const seen = new Map();
    for (let c = 0; c < 9; c += 1) {
      const v = grid[r][c];
      if (v === 0) continue;
      if (!seen.has(v)) seen.set(v, []);
      seen.get(v).push([r, c]);
    }
    for (const coords of seen.values()) {
      if (coords.length > 1) coords.forEach(([rr, cc]) => (conflicts[rr][cc] = true));
    }
  }

  for (let c = 0; c < 9; c += 1) {
    const seen = new Map();
    for (let r = 0; r < 9; r += 1) {
      const v = grid[r][c];
      if (v === 0) continue;
      if (!seen.has(v)) seen.set(v, []);
      seen.get(v).push([r, c]);
    }
    for (const coords of seen.values()) {
      if (coords.length > 1) coords.forEach(([rr, cc]) => (conflicts[rr][cc] = true));
    }
  }

  for (let b = 0; b < 9; b += 1) {
    const br = Math.floor(b / 3) * 3;
    const bc = (b % 3) * 3;
    const seen = new Map();
    for (let r = br; r < br + 3; r += 1) {
      for (let c = bc; c < bc + 3; c += 1) {
        const v = grid[r][c];
        if (v === 0) continue;
        if (!seen.has(v)) seen.set(v, []);
        seen.get(v).push([r, c]);
      }
    }
    for (const coords of seen.values()) {
      if (coords.length > 1) coords.forEach(([rr, cc]) => (conflicts[rr][cc] = true));
    }
  }

  return conflicts;
}

/**
 * Returns true if the grid is completely and correctly solved (no zeros, no conflicts).
 */
function isSolvedCorrectly(grid) {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (grid[r][c] === 0) return false;
      if (!isValidPlacement(grid, r, c, grid[r][c])) return false;
    }
  }
  return true;
}

// PUBLIC_INTERFACE
export function generateSudokuPuzzle(options = {}) {
  /** Generates a new Sudoku puzzle + solution. */
  const { difficulty = "easy" } = options;
  const solution = generateSolvedGrid(Math.random);
  const puzzle = makePuzzleFromSolution(solution, difficulty, Math.random);

  const fixed = puzzle.map((row) => row.map((v) => v !== 0));

  return { puzzle, solution, fixed };
}

// PUBLIC_INTERFACE
export function validateGrid(grid) {
  /** Returns conflicts map and solved status for UI. */
  const conflicts = computeConflicts(grid);
  const solved = isSolvedCorrectly(grid);
  return { conflicts, solved };
}

// PUBLIC_INTERFACE
export function applyCellValue(grid, r, c, val) {
  /** Returns a new grid with cell updated. */
  const next = cloneGrid(grid);
  next[r][c] = val;
  return next;
}

// PUBLIC_INTERFACE
export function isLegalMove(grid, r, c, val) {
  /** Checks whether a move is legal in the current grid (ignoring empties). */
  return isMoveLegal(grid, r, c, val);
}

// PUBLIC_INTERFACE
export function createEmptyGrid() {
  /** Creates a 9x9 empty grid (all zeros). */
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function _internal() {
  // For potential debugging; not a stable API.
  return { cloneGrid, boxIndex, computeCandidates, solveGrid };
}
