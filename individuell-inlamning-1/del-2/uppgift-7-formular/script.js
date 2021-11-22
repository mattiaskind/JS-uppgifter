'use strict';

// document.forms['booking-form'].getElementsByTagName('input');
const btnSend = document.querySelector('#btn-send');
const elements = document.querySelectorAll('input');

// const firstName = document.querySelector('#firstname');
// const lastName = document.querySelector('#lastname');
// const email = document.querySelector('#email');
// const dateFrom = document.querySelector('#date-from');
// const dateTo = document.querySelector('#date-to');
// const adress = document.querySelector('#adress');
// const city = document.querySelector('#city');
// const zipCode = document.querySelector('#zip-code');
// const password = document.querySelector('#password');

let bookingData = [];

btnSend.addEventListener('click', (e) => {
  e.preventDefault();

  elements.forEach((el) => {
    console.log(el.id);

    // if (el.id === 'firstname' || el.id === 'lastname' || el.id === 'city')
    //   validate(el.value, isValidInput);
  });

  // Spara input
  // for (const element of Object.values(elements)) {
  //   //bookingData.push({ id: element.id, value: element.value, valid: true });
  // }

  // Återställ eventuell tidigare output
  bookingData.forEach((element) => {
    console.log('ERROR');
  });

  // Kontrollera

  // Ge feedback
});

function validate(input, callback) {
  if (callback(input)) {
    console.log('VALID');
  } else {
    console.log('INVALID');
  }
}

// Jag har försökt knåpa ihop några olika regular expressions för att kontrollera
// inputen från formuläret. Dessa är antaglingen inte fungerande fullt ut men
// rensar åtminstone en hel del eventuell felaktig input.

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
  return regex.text(zipCode);
}
