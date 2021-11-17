'use strict';

const panelTooLow = document.querySelector('.panel-guess-low');
const panelTooHigh = document.querySelector('.panel-guess-high');
const panelResult = document.querySelector('.panel-guess-result');

const gameOver = document.querySelector('.game-over');
const btnPlayAgain = document.querySelector('.btn-play-again');

const inputGuess = document.querySelector('#input-guess');
const btnGuess = document.querySelector('#btn-guess');
const counter = document.querySelector('.counter');

let userGuess;
let numberGuessesLeft = 5;
const answer = Math.floor(Math.random() * 100 + 1);

counter.innerText = `${numberGuessesLeft} gissningar kvar`;

console.log('RÄTT SVAR ÄR: ' + answer);

btnGuess.addEventListener('click', (e) => {
  e.preventDefault();
  if (!inputGuess.value) return;
  userGuess = Number(inputGuess.value);
  if (Number.isNaN(userGuess)) return;

  if (userGuess > answer) console.log('För högt');
  if (userGuess < answer) console.log('För lågt');
  if (userGuess === answer) console.log('Rätt');

  console.log('user guess: ' + userGuess);
});
