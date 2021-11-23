'use strict';

// Formulärets skicka-knapp
const btnSend = document.querySelector('#btn-send');
// Alla element i formuläret, bortsett från reset-knappen och skicka-knappen
const elements = document.querySelectorAll(
  'input:not([type="reset"]):not([type="submit"])'
);

// Boxen som visar eventuella fel
const errorsContainer = document.querySelector('.errors');
// Listan som visar exakt vilka fel som inträffat
const errorsUl = document.querySelector('.error-list');
// Boxen med bokningsformuläret
const bookingForm = document.querySelector('#booking-form');
// Boxen som visar en genomförd bokning
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

///// GLOBALA VARIABLER /////
// Bokningsdata
let bookingData = [];
// Data över aktuella fel
let invalidInputs = [];
// Datum
let dates = [];

// Ger rätt återkoppling på svenska om något fält inte fyllts i korrekt
const errorList = {
  firstname:
    'Förnamnet måste bestå av minst två bokstäver. Bindestreck, mellanslag och apostrof är tillåtet',
  lastname:
    'Efternamnet måste bestå av minst två bokstäver. Bindestreck, mellanslag och apostrof är tillåtet',
  email: 'Du måste fylla i en korrekt e-postadress',
  date_from:
    'Fyll i ett korrekt datum för avresan. Datumet kan inte vara tidigare än dagens datum eller senare än datumet för avresan.',
  date_to:
    'Fyll i ett korrekt datum för hemresan. Datumet kan inte vara tidigare än dagens datum eller tidigare än datumet för avresan.',
  adress: 'Fyll i en adress',
  city: 'Fyll i en stad',
  zip_code: 'Fyll i ditt postnummer',
  password: 'Ditt lösenord måste bestå av ...',
};

///// HANTERA FORMULÄRET /////

// Lyssnar efter klick på formulärets skicka-knapp
btnSend.addEventListener('click', (e) => {
  e.preventDefault();
  // Återställ eventuella tidigare fel-loggar
  invalidInputs = [];
  // Återställ css-klasserna till sitt ursprung, dvs. ta bort tidigare fel
  resetErrorFields();
  // Töm listan som ev. håller tidigare inmatade datum
  dates = [];

  //Gå igenom inmatningen och kontrollera
  elements.forEach((element) => {
    // Förnamn, efternamn och stad har alla samma kontroll
    // prettier-ignore
    if (element.id === 'firstname' || element.id === 'lastname' || element.id === 'city') validate(element, isValidInput);

    // Kontrollera emiladressen
    if (element.id === 'email') validate(element, isValidEmail);

    // Kontrollera adressen
    if (element.id === 'adress') validate(element, isValidAdress);

    // Kontrollera postnumret
    if (element.id === 'zip_code') validate(element, isValidZipCode);

    // Lägg till datumen i listan som håller start- och slut-datum
    if (element.id === 'date_from' || element.id === 'date_to')
      dates.push({ id: element.id, value: element.value });

    if (element.id === 'password' && element.value.length > 0)
      console.log('Kontrollera lösenord');
  });

  // När såväl start- som slutdatum lagrats genomförs kontroll av datumen
  validateDates();

  // Om listan över eventuella fel innehåller fel
  if (invalidInputs.length > 0) {
    // Visa felmeddelanden
    renderErrors();

    // Annars, inga fel finns, bokningen kan genomföras
  } else {
    // Ta fram boxen som visar att bokningen genomförts
    // prettier-ignore
    if (!errorsContainer.classList.contains('hidden')) errorsContainer.classList.add('hidden');
    // Rendera bokningen
    renderBooking();
  }
});

///// FUNKTIONER /////

// Funktionen tar ett element som ska valideras och den callback-funktion som ska utföra
// kontrollen. Om callback-funktionen returnerar false läggs elementet till listan
// som lagrar felaktig inmatning.
function validate(element, callback) {
  if (!callback(element.value)) {
    invalidInputs.push(element.id);
  } else {
    bookingData[element.id] = element.value;
  }
}

// Kontrollerar datumen som användaren fyllt i
function validateDates() {
  // err indikerar om fel uppstår
  let err = false;
  // Gå igenom den globala datum-listan där det ska finnas lagrad information
  // om datuminmatningen
  dates.forEach((date) => {
    // Om inget datum fyllts i läggs data om det i listan över fel
    if (date.value === '') {
      invalidInputs.push(date.id);
      err = true;
    }
  });

  // Om fel uppstod ska inte funktionen fortsätta
  if (err) return;

  // Omvandla inmatade datum till datum-objekt för att jämföra.
  // Skapa även ett objekt för dagens datum för jämförelse
  const startDate = new Date(dates[0].value).setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const endDate = new Date(dates[1].value).setHours(0, 0, 0, 0);

  // console.log('current: ' + currentDate);
  // console.log(startDate);
  // console.log(endDate.getTime());

  // Kontrollera om start- och slutdatum är felaktigt ifyllda
  if (
    startDate > endDate ||
    startDate === endDate ||
    startDate < currentDate ||
    endDate < currentDate
  ) {
    // Vid felaktiga datum läggs data som indikerar det i listan över fel
    invalidInputs.push(dates[0].id, dates[1].id);
    err = true;
  }

  // Om fel finns returnera utan värde
  if (err) {
    return;
    // Annars läggs information om datum för bokningen i objektet med data om bokningen
  } else {
    bookingData.date_from = dates[0].value;
    bookingData.date_to = dates[1].value;
  }
}

// Funktionen renderar HTML vid en genomförd bokning och uppdaterar gränssnittet med
// datan om bokningen
function renderBooking() {
  // Göm formuläret, ta fram boxen som visar genomförd bokning
  bookingForm.classList.add('hidden');
  bookingConfirmed.classList.remove('hidden');

  // Skapa mall för genomförd bokning och lägg in i HTML-dokumentet
  bookingConfirmed.insertAdjacentHTML('afterbegin', getBookingHTML());

  // Ändra rubriken
  document.querySelector(
    '.header'
  ).innerHTML = `<h2>Tack för din bokning!</h2>`;

  // Välj aktuella element och uppdatera deras innehåll med utgångspunkt i
  // objektet som lagrar bokningsdatan.
  document.querySelector('.confirmed-name').innerText =
    bookingData.firstname + ' ' + bookingData.lastname;
  document.querySelector('.confirmed-mail').innerText = bookingData.email;

  document.querySelector('.confirmed-date_from').innerText =
    'Datum för avresa: ' + bookingData.date_from;
  document.querySelector('.confirmed-date_to').innerText =
    'Datum för hemresa: ' + bookingData.date_to;

  document.querySelector('.confirmed-adress').innerText = bookingData.adress;
  document.querySelector('.confirmed-city').innerText =
    bookingData.city + ' ' + formatZipCode(bookingData.zip_code);
}

// Platshållare för HTML
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
    <span class="confirmed-city"></span>
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

// Funktionen formaterar postnumret så att det visar siffrorna med ett blanksteg
function formatZipCode(zipCodeString) {
  let stringArray = zipCodeString.split('');
  stringArray.splice(3, 0, ' ');
  return stringArray.join('');
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

// Funktionen återställer utseendet på elementen, dvs tar bort den css-klass som används
// för att indikera felaktigt ifyllda fält
function resetErrorFields() {
  elements.forEach((element) => {
    if (invalidInputs.includes(element.id)) element.classList.remove('error');
  });
}

// Jag har skrivit några regular expressions för att kontrollera
// inmatningen från formuläret. Dessa är på en grundläggande nivå och stoppar
// inte alla tänkbara varianter av fel men åtminstone en del.

// Funktionerna returnerar antingen true eller false beroende på om input-variabeln kan
// matchas med reglerna för respektive regex.

// Inmatningen måste börja med en bokstav, a-ö, ', - eller blanksteg. Det måste finnas
// åtminstone två tecken. Versal/gemen spelar ingen roll
function isValidInput(input) {
  const regex = /^[a-ö' -]{2,}$/gi;
  return regex.test(input);
}

// Inmatningen måste börja med a-z, åtminstone ett tecken följt av en eller ingen punkt samt
// fler eller inga ytterligare bokstäver. Därefter måste det finnas ett @ som följs av en eller flera bokstäver
// a-z. Slutligen måste inmatningen innehålla en punkt och därefter mellan 2-4 bokstäver.
function isValidEmail(input) {
  const regex = /^[a-z]+\.*[a-z]*@[a-z]+\.[a-z]{2,4}$/gi;
  return regex.test(input);
}

// Inmatningen måste börja med en eller flera bokstäver a-ö. Därefter kan det förekomma ett blanksteg
// som följs av okänt antal ytterligare bokstäver, följt av ytterligare ett eventuellt blanksteg. Det får
// förekomma siffror men det krävs inte. Slutligen tillåts inmatningen avslutas med mellan 0 och 1 bokstav
function isValidAdress(input) {
  const regex = /^[a-ö]+[ ]*[a-ö]*[ ]*\d*\w?$/gi;
  return regex.test(input);
}

// Inmatningen får bestå av minst tre siffror ett mellanslag och därefter
// ytterligare två siffror. Alternativ fem siffror i en följd.
function isValidZipCode(input) {
  const regex = /(^\d{3} \d{2}$)|(^[\d]{5}$)/;
  return regex.test(input);
}
