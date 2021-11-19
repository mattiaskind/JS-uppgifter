'use strict';

const NUMBER_OF_GUESSES = 5;

const gameState = {
  guess: null,
  guessesLeft: NUMBER_OF_GUESSES,
  answer: Math.floor(Math.random() * 100 + 1),
  play: true,
};

const responses = {
  low: ['För lågt', 'Gissa högre', 'Tyvärr, det är högre'],
  high: ['För högt', 'Gissa lägre', 'Tyvärr, lägre'],
};

// Paneler
const panelTooLow = document.querySelector('.panel-guess-low');
const panelTooHigh = document.querySelector('.panel-guess-high');
const panelResult = document.querySelector('.panel-guess-result');
const panelGameOver = document.querySelector('.panel-game-over');
const panelWin = document.querySelector('.panel-win');

// Knappar
const btnGuess = document.querySelector('#btn-guess');
const btnPlayAgain = document.querySelectorAll('.btn-play-again');

// Inputfält
const inputGuess = document.querySelector('#input-guess');

const number = document.querySelector('.number-of-guesses-left');
const panelResultText = document.querySelector('.panel-guess-result--text');

console.log('RÄTT SVAR ÄR: ' + gameState.answer);

number.innerHTML = NUMBER_OF_GUESSES;
panelResultText.innerHTML = 'gissningar kvar';

btnGuess.addEventListener('click', handleUserGuess);
btnPlayAgain.forEach((btn) => {
  btn.addEventListener('click', playAgain);
});

function playAgain() {
  initGame();
  if (!panelGameOver.classList.contains('hidden'))
    panelGameOver.classList.add('hidden');
  if (!panelWin.classList.contains('hidden')) panelWin.classList.add('hidden');
}

function handleUserGuess(e) {
  e.preventDefault();
  if (!saveInput(inputGuess.value) || gameState.play === false) return;
  if (gameState.guess > 100 || gameState.guess < 1) {
    console.log('För litet eller högt tal!');
    return;
  }

  gameState.guessesLeft--;
  number.innerHTML = gameState.guessesLeft;

  checkGuess();
}

function updatePanelStatus(currentPanel, newPanel) {
  if (currentPanel.classList.contains('last-guess'))
    currentPanel.classList.remove('last-guess');
  newPanel.classList.add('last-guess');
}

function clearPanelStatus() {
  console.log('CLEAR');
}

function checkGuess() {
  const { guess, answer } = gameState;

  if (guess > answer) {
    clearPanels();
    updatePanelStatus(panelTooLow, panelTooHigh);

    const response = Math.floor(Math.random() * responses.high.length);
    panelTooHigh.innerText = responses.high[response] + '!';
  }
  if (guess < answer) {
    clearPanels();
    updatePanelStatus(panelTooHigh, panelTooLow);

    const response = Math.floor(Math.random() * responses.low.length);
    panelTooLow.innerText = responses.low[response] + '!';
  }
  if (guess === answer) {
    clearPanels();
    number.innerHTML = gameState.answer;
    panelResultText.innerHTML = '';
    panelWin.classList.remove('hidden');
  } else if (gameState.guessesLeft === 0) {
    gameState.play = false;
    gameOver();
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

function clearPanels() {
  panelTooLow.innerHTML = panelTooHigh.innerHTML = '';
}

function gameOver() {
  panelGameOver.classList.remove('hidden');
  initGame();
}

function initGame() {
  gameState.guessesLeft = NUMBER_OF_GUESSES;
  gameState.answer = Math.floor(Math.random() * 100 + 1);
  gameState.play = true;

  inputGuess.value = '';
  number.innerHTML = NUMBER_OF_GUESSES;
  panelResultText.innerHTML = 'gissningar kvar';

  clearPanels();
}
