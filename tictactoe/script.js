`use strict`;
const tiles = document.querySelectorAll(".tile");
const firstPlayer = "X";
const secondPlayer = "O";

let turn = firstPlayer;
let firstPlayerScore = 0;
let secondPlayerScore = 0;
const boxState = Array(tiles.length).fill(null);

const firstPlayerScoreElement = document.getElementById("first-player-score");
const secondPlayerScoreElement = document.getElementById("second-player-score");
const wincombo = document.getElementById("wincombo");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");

playAgain.addEventListener("click", startNewGame);
tiles.forEach((tile) => tile.addEventListener("click", tileClick));

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
    boxState[tileNumber - 1] = firstPlayer;
    turn = secondPlayer;
  } else {
    tile.innerText = secondPlayer;
    boxState[tileNumber - 1] = secondPlayer;
    turn = firstPlayer;
  }

  setHoverText();
  checkWinner();
}

function checkWinner() {
  for (const winningCombination of winningCombinations) {
    const { combination, wincomboClass } = winningCombination;
    const tileValue1 = boxState[combination[0] - 1];
    const tileValue2 = boxState[combination[1] - 1];
    const tileValue3 = boxState[combination[2] - 1];

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      wincombo.classList.add(wincomboClass);
      gameOverScreen(tileValue1);
      return;
    }
  }

  const allTileFilledIn = boxState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
    if (winnerText === firstPlayer) {
      firstPlayerScore++;
    } else if (winnerText === secondPlayer) {
      secondPlayerScore++;
    }
    updateScore();
  }
  gameOverArea.classList.add("visible");
  gameOverText.innerText = text;
}

function updateScore() {
  firstPlayerScoreElement.innerText = `Player 1: ${firstPlayerScore}`;
  secondPlayerScoreElement.innerText = `Player 2: ${secondPlayerScore}`;
}

function startNewGame() {
  wincombo.className = "wincombo";
  gameOverArea.classList.remove("visible");
  boxState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = firstPlayer;
  setHoverText();
  updateScore();
}

class WinningCombination {
  constructor(combination, wincomboClass) {
    this.combination = combination;
    this.wincomboClass = wincomboClass;
  }
}

const winningCombinations = [
  new WinningCombination([1, 2, 3], "wincombo-row-1"),
  new WinningCombination([4, 5, 6], "wincombo-row-2"),
  new WinningCombination([7, 8, 9], "wincombo-row-3"),
  new WinningCombination([1, 4, 7], "wincombo-column-1"),
  new WinningCombination([2, 5, 8], "wincombo-column-2"),
  new WinningCombination([3, 6, 9], "wincombo-column-3"),
  new WinningCombination([1, 5, 9], "wincombo-diagonal-1"),
  new WinningCombination([3, 5, 7], "wincombo-diagonal-2"),
];
