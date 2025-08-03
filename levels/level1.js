const ROWS = 7;
const COLS = 7;
const TOTAL = ROWS * COLS; // 49

// 1) A tiny linear-congruential generator (LCG) for deterministic randomness
function makeSeededRNG(seed) {
  const m = 0x80000000; // 2^31
  const a = 1103515245;
  const c = 12345;
  let state = seed;
  return () => {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

// 2) Fisher-Yates shuffle, but using our seeded RNG
function seededShuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 3) Count inversions (ignoring the null tile)
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

// 4) For odd-width boards, solvable iff inversion count is even
function isSolvable(arr) {
  return countInversions(arr) % 2 === 0;
}

function isAdjacent(idx1, idx2) {
  const r1 = Math.floor(idx1 / COLS),
    c1 = idx1 % COLS;
  const r2 = Math.floor(idx2 / COLS),
    c2 = idx2 % COLS;
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

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

function checkWin(tiles) {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (tiles[i] !== i + 1) return;
  }
  if (tiles[TOTAL - 1] === null) {
    setTimeout(() => {
      document.getElementById("popup-message").textContent =
        "Congrats, the first number is 4";
      document.getElementById("popup").style.display = "flex";
    }, 100);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sliding-puzzle");

  // Build the “solved” tile array: [1,2,3…48,null]
  let tiles = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1);
  tiles.push(null);

  // Pick any fixed seed you like (e.g. based on date, username, etc.)
  const SEED = 123456;
  const rng = makeSeededRNG(SEED);

  // Shuffle once, then ensure solvability
  seededShuffle(tiles, rng);
  if (!isSolvable(tiles)) {
    // Swap any two non-null tiles to flip parity
    const swapA = 0;
    const swapB = 1;
    [tiles[swapA], tiles[swapB]] = [tiles[swapB], tiles[swapA]];
  }

  renderPuzzle(tiles, container);
});
