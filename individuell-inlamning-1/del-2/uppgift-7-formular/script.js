'use strict';

// document.forms['booking-form'].getElementsByTagName('input');
const btnSend = document.querySelector('#btn-send');
const elements = document.querySelectorAll('input');

const errorsContainer = document.querySelector('.errors');
const errorsUl = document.querySelector('.error-list');
const bookingForm = document.querySelector('#booking-form');

// const firstName = document.querySelector('#firstname');
// const lastName = document.querySelector('#lastname');
// const email = document.querySelector('#email');
// const dateFrom = document.querySelector('#date_from');
// const dateTo = document.querySelector('#date_to');
// const adress = document.querySelector('#adress');
// const city = document.querySelector('#city');
// const zipCode = document.querySelector('#zip_code');
// const password = document.querySelector('#password');

let bookingData = [];
let invalidInputs = [];

// Ger rätt återkoppling på svenska om något fält inte fyllts i korrekt
const errorList = {
  firstname: 'Förnamnet måste bestå av bokstäver',
  lastname: 'Efternamnet måste bestå av bokstäver',
  email: 'Du måste fylla i en korrekt e-postadress',
  date_from: 'Fyll i ett datum, från och med',
  date_to: 'Fyll i ett datum, till och med',
  adress: 'Fyll i en adress',
  city: 'Fyll i en stad',
  zip_code: 'Fyll i ditt postnummer',
  password: 'Ditt lösenord måste bestå av ...',
};

btnSend.addEventListener('click', (e) => {
  e.preventDefault();
  // Återställ eventuella tidigare fel-loggar
  resetErrorFields();
  invalidInputs = [];

  // Gå igenom inmatningen och kontrollera
  elements.forEach((element) => {
    //console.log(element.id);
    if (
      element.id === 'firstname' ||
      element.id === 'lastname' ||
      element.id === 'city'
    )
      validate(element, isValidInput);
    if (element.id === 'email') validate(element, isValidEmail);
    if (element.id === 'adress') validate(element, isValidAdress);
    if (element.id === 'zip_code') validate(element, isValidZipCode);

    if (element.id === 'date_to') console.log(element.id);

    if (element.id === 'password' && element.id.length > 0)
      console.log('Kontrollera lösenord');
  });

  // Kontrollera och ge feedback
  if (invalidInputs.length > 0) {
    renderErrors();
  } else {
    if (!errorsContainer.classList.contains('hidden'))
      errorsContainer.classList.add('hidden');
  }
});

// Funktionen tar ett element som ska valideras och den callback-funktion som ska utföra
// kontrollen. Om callback-funktionen returnerar false läggs elementet till listan med
// som lagrar felaktig inmatning.
function validate(element, callback) {
  if (!callback(element.value)) invalidInputs.push(element.id);
}

// Funktionern renderar felmeddelanden baserat på listan med felaktig inmatning
function renderErrors() {
  errorsContainer.classList.remove('hidden');
  let html = '';
  elements.forEach((element) => {
    // console.log(element.id);
    if (invalidInputs.includes(element.id)) {
      element.classList.add('error');
      html += `<li>${errorList[element.id]}</li>`;
    }
  });
  errorsUl.innerHTML = html;
}

// Återställer inputen
function resetErrorFields() {
  elements.forEach((element) => {
    if (invalidInputs.includes(element.id)) element.classList.remove('error');
  });
}

// Jag har försökt knåpa ihop några olika regular expressions för att kontrollera
// inputen från formuläret. Dessa är antaglingen inte fungerande fullt ut men
// rensar åtminstone en del eventuell felaktig input.

function isValidInput(name) {
  // Från start av strängen (^) kontrolleras att namnet består av bokstäverna
  // a-ö. Blanksteg samt ' är också tillåtna tecken. Variabeln måste bestå av ett
  // eller lfera tecken
  const regex = /^[a-ö' -]+$/gi;
  return regex.test(name);
}

function isValidEmail(email) {
  // Kontrollen görs från starten av strängen med ^. Därefter måste
  // det finnas ett eller flera tecken
  const regex = /^[a-z\.]+@[a-z]+\.[a-z]{2,4}/gi;
  return regex.test(email);
}

function isValidAdress(adress) {
  const regex = /^[a-ö]+[ ]*[a-ö]*[ ]*\d*\w?$/gi;
  return regex.test(adress);
}

function isValidZipCode(zipCode) {
  // Returernar true om varibeln består av min tre siffror, ett mellanslag och därefter
  // ytterligare två siffror alternativ fem siffror i en följd. Annars returneras false
  // Med hjälp av parenteserna och | skapar jag två grupper som tillåts.
  const regex = /(^\d{3} \d{2}$)|(^[\d]{5}$)/;
  return regex.test(zipCode);
}
