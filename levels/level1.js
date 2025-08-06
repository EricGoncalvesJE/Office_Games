const ROWS = 5;
const COLS = 5;
const TOTAL = ROWS * COLS;

function checkWin(tiles) {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (tiles[i] !== i + 1) return;
  }
  if (tiles[TOTAL - 1] === null) {
    setTimeout(() => {
      document.getElementById("popup-message").textContent =
        "Congratulations! The first number is 4. Keep it safe";
      document.getElementById("popup").style.display = "flex";

      // Save progress
      if (saveProgressCookie("level1")) {
      } else {
        // Fallback: Show message to user
        document.getElementById("popup-message").textContent +=
          "\n(Progress might not be saved in private browsing)";
      }
    }, 300);
  }
}

// Seeded RNG for deterministic randomness
function makeSeededRNG(seed) {
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;
  let state = seed;
  return () => {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

// Fisher-Yates shuffle with seeded RNG
function seededShuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Count inversions (ignoring the empty tile)
function countInversions(arr) {
  let inv = 0;
  const flat = arr.filter((v) => v !== null);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inv++;
    }
  }
  return inv;
}

// Solvable if inversion count is even (for odd grid size)
function isSolvable(arr) {
  return countInversions(arr) % 2 === 0;
}

// Check if two tiles are adjacent
function isAdjacent(idx1, idx2) {
  const r1 = Math.floor(idx1 / COLS),
    c1 = idx1 % COLS;
  const r2 = Math.floor(idx2 / COLS),
    c2 = idx2 % COLS;
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

// Render puzzle tiles
function renderPuzzle(tiles, container) {
  container.innerHTML = "";
  tiles.forEach((num, idx) => {
    const tile = document.createElement("div");
    tile.className = "tile" + (num === null ? " empty" : "");
    tile.textContent = num || "";
    tile.dataset.index = idx;
    tile.onclick = () => {
      const emptyIdx = tiles.indexOf(null);
      if (isAdjacent(idx, emptyIdx)) {
        [tiles[idx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[idx]];
        renderPuzzle(tiles, container);
        checkWin(tiles);
      }
    };
    container.appendChild(tile);
  });
}

// Check win condition
function checkWin(tiles) {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (tiles[i] !== i + 1) return;
  }
  if (tiles[TOTAL - 1] === null) {
    setTimeout(() => {
      document.getElementById("popup-message").textContent =
        "Congratulations! The first number is 4. Keep it safe";
      document.getElementById("popup").style.display = "flex";
    }, 300);
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sliding-puzzle");

  // Generate tiles [1,2,3...24,null]
  let tiles = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1);
  tiles.push(null);

  // Generate random seed for each session
  const SEED = Math.floor(Math.random() * 1000000);
  const rng = makeSeededRNG(SEED);

  // Shuffle and ensure solvability
  seededShuffle(tiles, rng);
  if (!isSolvable(tiles)) {
    const swapA = 0;
    const swapB = 1;
    [tiles[swapA], tiles[swapB]] = [tiles[swapB], tiles[swapA]];
  }

  renderPuzzle(tiles, container);

  // Close popup handler
  document
    .querySelector(".popup-content button")
    .addEventListener("click", () => {
      document.getElementById("popup").style.display = "none";
    });
});
