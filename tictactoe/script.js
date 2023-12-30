// Constants
const tiles = document.querySelectorAll(".tile");
const firstPlayer = "X";
const secondPlayer = "O";

// Game state
let turn = firstPlayer;
let player1Score = 0;
let player2Score = 0;
const boardState = Array(tiles.length).fill(null);

// HTML elements
const player1ScoreElement = document.getElementById("player1-score");
const player2ScoreElement = document.getElementById("player2-score");
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");

// Event listeners
playAgain.addEventListener("click", startNewGame);
tiles.forEach((tile) => tile.addEventListener("click", tileClick));

// Functions
function setHoverText() {
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(hoverClass);
    }
  });
}

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {
    return;
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;
  if (tile.innerText != "") {
    return;
  }

  if (turn === firstPlayer) {
    tile.innerText = firstPlayer;
    boardState[tileNumber - 1] = firstPlayer;
    turn = secondPlayer;
  } else {
    tile.innerText = secondPlayer;
    boardState[tileNumber - 1] = secondPlayer;
    turn = firstPlayer;
  }

  setHoverText();
  checkWinner();
}

function checkWinner() {
  for (const winningCombination of winningCombinations) {
    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    if (tileValue1 != null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
      strike.classList.add(strikeClass);
      gameOverScreen(tileValue1);
      return;
    }
  }

  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
    if (winnerText === firstPlayer) {
      player1Score++;
    } else if (winnerText === secondPlayer) {
      player2Score++;
    }
    updateScore();
  }
  gameOverArea.classList.add("visible");
  gameOverText.innerText = text;
}

function updateScore() {
  player1ScoreElement.innerText = `Player 1: ${player1Score}`;
  player2ScoreElement.innerText = `Player 2: ${player2Score}`;
}

function startNewGame() {
  strike.className = "strike";
  gameOverArea.classList.remove("visible");
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = firstPlayer;
  setHoverText();
  updateScore();
}

// Winning combinations
class WinningCombination {
  constructor(combo, strikeClass) {
    this.combo = combo;
    this.strikeClass = strikeClass;
  }
}

const winningCombinations = [
  new WinningCombination([1, 2, 3], "strike-row-1"),
  new WinningCombination([4, 5, 6], "strike-row-2"),
  new WinningCombination([7, 8, 9], "strike-row-3"),
  new WinningCombination([1, 4, 7], "strike-column-1"),
  new WinningCombination([2, 5, 8], "strike-column-2"),
  new WinningCombination([3, 6, 9], "strike-column-3"),
  new WinningCombination([1, 5, 9], "strike-diagonal-1"),
  new WinningCombination([3, 5, 7], "strike-diagonal-2"),
];
