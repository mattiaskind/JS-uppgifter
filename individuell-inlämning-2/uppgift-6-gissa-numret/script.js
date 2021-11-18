'use strict';

let gameState = {
  guess: null,
  guessesLeft: 5,
  answer: Math.floor(Math.random() * 100 + 1),
};

const panelTooLow = document.querySelector('.panel-guess-low');
const panelTooHigh = document.querySelector('.panel-guess-high');
const panelResult = document.querySelector('.panel-guess-result');
const gameOverPanel = document.querySelector('.game-over');
const btnPlayAgain = document.querySelector('.btn-play-again');
const panelPlayAgainWin = document.querySelector('.play-again-win');
const inputGuess = document.querySelector('#input-guess');
const btnGuess = document.querySelector('#btn-guess');
const number = document.querySelector('.number');

console.log('RÄTT SVAR ÄR: ' + gameState.answer);

btnGuess.addEventListener('click', (e) => {
  e.preventDefault();
  if (!saveInput(inputGuess.value)) return;
  if (gameState.guess > 100 || gameState.guess < 1)
    console.log('För litet eller högt tal!');

  gameState.guessesLeft--;
  if (gameState.guessesLeft === 0) {
    gameOver();
  } else {
    number.innerHTML = gameState.guessesLeft;
  }
  checkGuess();
});

function checkGuess() {
  const { guess, answer } = gameState;

  if (guess > answer) {
    panelTooLow.innerHTML = '';
    if (panelTooLow.classList.contains('last-guess'))
      panelTooLow.classList.remove('last-guess');
    panelTooHigh.classList.add('last-guess');
    panelTooHigh.innerHTML = 'För högt!';
  }
  if (guess < answer) {
    panelTooHigh.innerHTML = '';
    if (panelTooHigh.classList.contains('last-guess'))
      panelTooHigh.classList.remove('last-guess');
    panelTooLow.classList.add('last-guess');
    panelTooLow.innerHTML = 'För lågt!';
  }
  if (guess === answer) {
    panelTooHigh.innerHTML = panelTooLow.innerHTML = '';
    panelResult.innerHTML = answer;
    number.innerHTML = 'RÄTT!';
    panelPlayAgainWin.classList.remove('hidden');
  }
}

// Funktionen kontrollerar samt sparar input-argumentet i game state-objektet
// returnerar true eller false beroende på utfall
function saveInput(input) {
  if (!input) return false;
  let guess = Number(input);
  if (Number.isNaN(guess)) return false;
  gameState.guess = guess;
  return true;
}

function gameOver() {
  gameOverPanel.classList.remove('hidden');
}
