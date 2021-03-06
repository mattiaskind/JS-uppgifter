'use strict';

//////////// GLOBALA VARIABLER ////////////

// en konstant för totala antalet gissningar spelaren har
const NUMBER_OF_GUESSES = 8;

const gameState = {
  // guess lagrar det senast gissade numret
  guess: null,
  // antal gissningar totalt
  guessesLeft: NUMBER_OF_GUESSES,
  // det rätta svaret
  answer: Math.floor(Math.random() * 100 + 1),
  // indikerar huruvida spelet pågår eller inte
  gameInProgress: true,
  // indikerar om den senast inmatade gissningen var tom eller utanför intervallet
  outOfRangeOrEmpty: false,
};

const responses = {
  low: ['För lågt gissat', 'Gissa högre', 'Tyvärr, det är högre'],
  high: ['För högt gissat', 'Gissa lägre', 'Tyvärr, gissa lägre'],
};

//////////// DOM-element ////////////

// Paneler
const panelTooLow = document.querySelector('.panel-guess-low');
const panelTooHigh = document.querySelector('.panel-guess-high');
const panelGuessesLeft = document.querySelector('.panel-guesses-left');
const panelGameOver = document.querySelector('.panel-game-over');
const panelWin = document.querySelector('.panel-win');

// Knappar
const btnGuess = document.querySelector('#btn-guess');
const btnPlayAgain = document.querySelectorAll('.btn-play-again');

// Inputfält
const inputGuess = document.querySelector('#input-guess');

// Övrigt
const number = document.querySelector('.number-of-guesses-left');
const panelGuessesLeftText = document.querySelector('.panel-guesses-left--text');
const inputLabel = document.querySelector('#label');
const answerGameOver = document.querySelector('.answer-game-over');
const answerWin = document.querySelector('.answer-win');

//console.log('RÄTT SVAR ÄR: ' + gameState.answer);

//////////// EVENT HANDLERS ////////////

number.innerHTML = NUMBER_OF_GUESSES;
panelGuessesLeftText.innerHTML = 'gissningar kvar';

btnGuess.addEventListener('click', handleUserGuess);
btnPlayAgain.forEach((btn) => {
  btn.addEventListener('click', initGame);
});

//////////// FUNKTIONER ////////////

function handleUserGuess(e) {
  e.preventDefault();

  // Kontrollera om fältet är tomt när användaren klicka på gissa-knappen
  if (inputGuess.value === '') {
    inputLabel.innerHTML = 'Du måste fylla i ett nummer! 😅';
    gameState.outOfRangeOrEmpty = true;
    return;

    // Fältet är inte tomt, funktionen saveInput som försöker omvandla
    // inmatningen till ett nummer anropas. Om omvandlingen misslyckas eller
    // om spelet inte pågår avslutas funktionen.
    // Det här hindrar besökaren från att fortsätta ett avslutat spel eller
    // ge felaktig inmatning genom att ändra i html-koden (exempelvis genom att lägga
    // css-klassen hidden på element eller ändra input-fältet från number till text).
  } else if (!saveInput(inputGuess.value) || gameState.gameInProgress === false) {
    return;
  }

  // Kontrollera om användaren har matat in en siffra utanför intervallet 1-100
  if (gameState.guess > 100 || gameState.guess < 1) {
    gameState.outOfRangeOrEmpty = true;
    inputLabel.innerHTML = 'Du måste gissa mellan 1 och 100! 🙈';
    return;

    // Siffran som matats in är inom intervallet, kontrollera om den tidigare
    // inmatningen var utanför intervallet och ge respons på det.
  } else if (gameState.outOfRangeOrEmpty) {
    inputLabel.innerHTML = 'Bra, fortsätt gissa! 😊';
    gameState.outOfRangeOrEmpty = false;
  }

  // Minska antalet kvarvarande gissningar och anropa
  // funktion för att jämföra gissningen med svaret
  gameState.guessesLeft--;
  number.innerHTML = gameState.guessesLeft;
  checkGuess();
}

// Den här funktionen har jag skrivit för att underlätta uppdatering av class-attributen
// och för att slippa skriva samma kod på flera ställen. Den används i samband med
// att gissningarna jämförs med svaret.
function updatePanelStatus(currentPanel, newPanel) {
  if (currentPanel.classList.contains('last-guess')) currentPanel.classList.remove('last-guess');
  newPanel.classList.add('last-guess');
}

// Funktionen används för att kontrollera en gissning
function checkGuess() {
  const { guess, answer } = gameState;

  // Kontrollera om gissningen är för hög, för låg eller om det är rätt svar

  if (guess > answer) {
    // Ta bort tidigare text i panelerna som lämnar respons på inmatningen
    panelsDeleteText();
    // Uppdatera panelerna baserat på den nuvarande inmatningen
    updatePanelStatus(panelTooLow, panelTooHigh);

    // Slumpa fram en respons på den för höga inmatningen
    const response = Math.floor(Math.random() * responses.high.length);
    panelTooHigh.innerText = responses.high[response] + '!';
  }
  if (guess < answer) {
    // Ta bort tidigare text i panelerna som lämnar respons på inmatningen
    panelsDeleteText();
    // Uppdatera panelerna baserat på den nuvarande inmatningen
    updatePanelStatus(panelTooHigh, panelTooLow);

    // Slumpa fram en respons på den för låga inmatningen
    const response = Math.floor(Math.random() * responses.low.length);
    panelTooLow.innerText = responses.low[response] + '!';
  }
  if (guess === answer) {
    playerWins();
  } else if (gameState.guessesLeft === 0) {
    gameState.gameInProgress = false;
    gameOver();
  }
}

// Funktionen kontrollerar samt sparar input-argumentet i game state-objektet
// om det går att omvandla inmatningen till ett nummer.
// Returnerar true eller false beroende på utfall
function saveInput(input) {
  let guess = Number(input);
  if (Number.isNaN(guess)) return false;
  gameState.guess = guess;
  return true;
}

// Tar bort text från panelerna
function panelsDeleteText() {
  panelTooLow.innerHTML = panelTooHigh.innerHTML = '';
}

// Nollställer paneler: tar bort text och bakgrundsfärg
function clearPanels(panels) {
  panels.forEach((el) => {
    if (el.classList.contains('last-guess')) el.classList.remove('last-guess');
  });
  panelsDeleteText();
}

// Gömmer paneler
function hidePanels(panels) {
  panels.forEach((el) => {
    if (!el.classList.contains('hidden')) el.classList.add('hidden');
  });
}

// Tar fram panelen och info som visar att spelet förlorades
function gameOver() {
  panelsDeleteText();
  number.innerHTML = '';
  panelGuessesLeftText.innerHTML = '';
  panelGameOver.classList.remove('hidden');
  answerGameOver.innerHTML = `Svaret var ${gameState.answer}!`;
}

// Tar fram panelen och info som visar att användaren gissade rätt
function playerWins() {
  panelsDeleteText();
  number.innerHTML = '';
  panelGuessesLeftText.innerHTML = '';
  panelWin.classList.remove('hidden');
  answerWin.innerHTML = `Svaret är ${gameState.answer}!`;
}

// Initierar spelet, om användaren vill spela igen efter avslutat spel
function initGame() {
  // Återställer gameState-objektet
  gameState.guessesLeft = NUMBER_OF_GUESSES;
  gameState.answer = Math.floor(Math.random() * 100 + 1);
  gameState.gameInProgress = true;

  // Återställer användargränssnittet
  inputGuess.value = '';
  number.innerHTML = NUMBER_OF_GUESSES;
  panelGuessesLeftText.innerHTML = 'gissningar kvar';
  clearPanels([panelTooLow, panelTooHigh]);
  hidePanels([panelGameOver, panelWin]);

  // Återställ formulärtexten
  inputLabel.innerHTML = 'Gissa ett nummer mellan 1 och 100!';

  //console.log(gameState.answer);
}
