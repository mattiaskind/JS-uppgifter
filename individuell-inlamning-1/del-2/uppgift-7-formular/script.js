'use strict';

// document.forms['booking-form'].getElementsByTagName('input');
const btnSend = document.querySelector('#btn-send');
const elements = document.querySelectorAll(
  'input:not([type="reset"]):not([type="submit"])'
);

const errorsContainer = document.querySelector('.errors');
const errorsUl = document.querySelector('.error-list');
const bookingForm = document.querySelector('#booking-form');
const bookingConfirmed = document.querySelector('.confirmed-booking');

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
let dates = {};

// Ger rätt återkoppling på svenska om något fält inte fyllts i korrekt
const errorList = {
  firstname: 'Förnamnet måste bestå av bokstäver',
  lastname: 'Efternamnet måste bestå av bokstäver',
  email: 'Du måste fylla i en korrekt e-postadress',
  date_from: 'Fyll i ett korrekt datum för avresan',
  date_to: 'Fyll i ett korrekt datum för hemresan',
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
  dates = [];

  // Gå igenom inmatningen och kontrollera
  // elements.forEach((element) => {
  //   //console.log(element.id);
  //   if (
  //     element.id === 'firstname' ||
  //     element.id === 'lastname' ||
  //     element.id === 'city'
  //   )
  //     validate(element, isValidInput);
  //   if (element.id === 'email') validate(element, isValidEmail);
  //   if (element.id === 'adress') validate(element, isValidAdress);
  //   if (element.id === 'zip_code') validate(element, isValidZipCode);

  //   if (element.id === 'date_from' || element.id === 'date_to')
  //     dates.push({ id: element.id, value: element.value });

  //   // Lägg till funktion som kan kontrollera datum
  //   // Fixa regex, namn i allmänhet ska inte räcka med enbart en bokstav
  //   if (element.id === 'password' && element.value.length > 0)
  //     console.log('Kontrollera lösenord');
  // });

  // validateDates(dates);

  // Kontrollera och ge feedback
  if (invalidInputs.length > 0) {
    renderErrors();
  } else {
    if (!errorsContainer.classList.contains('hidden'))
      errorsContainer.classList.add('hidden');
    renderBooking();
  }
});

// Funktionen tar ett element som ska valideras och den callback-funktion som ska utföra
// kontrollen. Om callback-funktionen returnerar false läggs elementet till listan
// som lagrar felaktig inmatning.
function validate(element, callback) {
  if (!callback(element.value)) invalidInputs.push(element.id);
}

// Kontrollerar datumen som användaren fyllt i
function validateDates(dates) {
  let err = false;
  dates.forEach((date) => {
    if (date.value === '') {
      invalidInputs.push(date.id);
      err = true;
    }
  });
  if (err) return;

  const startDate = new Date(dates[0].value).getTime();
  const endDate = new Date(dates[1].value).getTime();
  const currentDate = new Date().getTime();

  // console.log(currentDate);
  // console.log(startDate.getTime());
  // console.log(endDate.getTime());

  if (
    startDate > endDate ||
    startDate === endDate ||
    startDate < currentDate ||
    endDate < currentDate
  ) {
    invalidInputs.push(dates[0].id, dates[1].id);
  }
}

function renderBooking(elements) {
  bookingForm.classList.add('hidden');
  bookingConfirmed.classList.remove('hidden');
  // document.querySelector('.confirmed-name').innerText = "HEJ";

  // Måste fixa så att bokningsdatan sparas i ett objekt
}

function getBookingHTML() {
  return `
  <div class="item1">
    <h4>Namn</h4>
    <span class="confirmed-name"></span>
    <span class="confirmed-mail"></span>
  </div>
  <div class="item2">
    <h4>Adress</h4>
    <span class="confirmed-adress"></span>
  </div>
  <div class="item3">
  <h4>Datum för din resa</h4>
    <span class="confirmed-date_from">Avresedatum: 1231 123123</span>
    <span class="confirmed-date_to">Hemresedatum: 1231 123123</span>    
  </div>
  <div class="4">
    <h4>Medlem</h4>
    <span class="confirmed-member"></span>
  </div>  
  `;
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
  // a-ö. Blanksteg samt ' är också tillåtna tecken. Variabeln måste bestå av minst
  // två tecken
  const regex = /^[a-ö' -]{2,}$/gi;
  return regex.test(name);
}

function isValidEmail(email) {
  // Kontrollen görs från starten av strängen med ^. Därefter måste
  // det finnas ett eller flera tecken
  const regex = /^[a-z]+\.*[a-z]*@[a-z]+\.[a-z]{2,4}$/gi;
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
