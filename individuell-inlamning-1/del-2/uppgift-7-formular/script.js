'use strict';

///// GLOBALA ELEMENT /////

// Formulärets knappar
const btnSend = document.querySelector('#btn-send');
const btnReset = document.querySelector('#btn-reset');
// Alla element i formuläret, bortsett från reset-knappen och skicka-knappen
const elements = document.querySelectorAll('input:not([type="reset"]):not([type="submit"])');
const reqFields = document.getElementsByClassName('req');

// Boxen som visar eventuella fel
const errorsContainer = document.querySelector('.errors');
// Listan som visar exakt vilka fel som inträffat
const errorsUl = document.querySelector('.error-list');
// Boxen med bokningsformuläret
const bookingForm = document.querySelector('#booking-form');
// Boxen som visar en genomförd bokning
const bookingConfirmed = document.querySelector('.confirmed-booking');

///// GLOBALA VARIABLER /////

// Bokningsdata
let bookingData = [];
// Data över aktuella fel
let invalidInputs = [];
// Datum
let dates = [];

// Ger rätt återkoppling på svenska om något fält inte fyllts i korrekt
const errorList = {
  firstname: 'Förnamnet måste bestå av minst två bokstäver. Bindestreck, mellanslag och apostrof är tillåtet',
  lastname: 'Efternamnet måste bestå av minst två bokstäver. Bindestreck, mellanslag och apostrof är tillåtet',
  email: 'Du måste fylla i en korrekt e-postadress',
  date_from:
    'Något datum är felaktigt ifyllt. Datumet för avresan kan inte vara tidigare än dagens datum eller senare än datumet för avresan.',
  date_to:
    'Något datum är felaktigt ifyllt. Datumet för hemresan måste vara senare än dagens datum och senare än datumet för avresan.',
  adress: 'Fyll i en adress',
  city: 'Fyll i en stad',
  zip_code: 'Fyll i ditt postnummer',
  password:
    'Ditt lösenord måste vara minst 6 tecken långt samt bestå av bokstäver, siffror och ett eller flera specialtecken !"#¤%&=?@£$€',
  destination: 'Du måste fylla i en destination',
};

///// HANTERA FORMULÄRET /////

// Ser till att knappen skicka bara aktiveras om alla obligatoriska fält är ifyllda
btnSend.disabled = true;
for (let i = 0; i < reqFields.length; i++) {
  reqFields[i].addEventListener('input', function () {
    btnSend.disabled = false;
    for (let j = 0; j < reqFields.length; j++) {
      if (!reqFields[j].value) btnSend.disabled = true;
    }
  });
}

// Inaktivera skicka-knappen om användaren klickar på rensa
btnReset.addEventListener('click', function () {
  btnSend.disabled = true;
});

// Lyssnar efter klick på formulärets skicka-knapp
btnSend.addEventListener('click', (e) => {
  e.preventDefault();
  // Återställ fälten till ursprungsutseende
  // det måste göras innan listorna återställs, note to self - flytta inte på den här :-)
  resetErrorFields();
  // Återställ eventuella tidigare fel-loggar
  invalidInputs = [];
  // Töm listan som ev. håller tidigare inmatade datum
  dates = [];

  //Gå igenom inmatningen och kontrollera
  elements.forEach((element) => {
    // Förnamn, efternamn, stad och destination har alla samma kontroll
    if (
      element.id === 'firstname' ||
      element.id === 'lastname' ||
      element.id === 'city' ||
      element.id === 'destination'
    )
      validate(element, isValidInput);

    // Kontrollera emiladressen
    if (element.id === 'email') validate(element, isValidEmail);

    // Kontrollera adressen
    if (element.id === 'adress') validate(element, isValidAdress);

    // Kontrollera postnumret
    if (element.id === 'zip_code') validate(element, isValidZipCode);

    // Lägg till datumen i listan som håller start- och slut-datum
    if (element.id === 'date_from' || element.id === 'date_to') dates.push({ id: element.id, value: element.value });

    // Om det finns ett lösenord ifyllt ska det kontrolleras
    if (element.id === 'password' && element.value.length > 0) validate(element, isValidPassword);
  });

  // När såväl start- som slutdatum lagrats genomförs kontroll av datumen
  validateDates();

  // Om något lagts till listan som innehåller fel
  if (invalidInputs.length > 0) {
    // Visa felmeddelanden
    renderErrors();

    // Annars, inga fel finns, bokningen kan genomföras
  } else {
    // Ta fram boxen som visar att bokningen genomförts
    if (!errorsContainer.classList.contains('hidden')) errorsContainer.classList.add('hidden');
    // Rendera bokningen
    renderBooking();
  }
});

///// FUNKTIONER /////

// Funktionen tar ett element som ska valideras och den callback-funktion som ska utföra
// kontrollen. Om callback-funktionen returnerar false läggs elementet till listan
// som lagrar felaktig inmatning. Annars läggs datan in i objektet som lagrar bokningsdatan
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
    // Om inget datum fyllts i läggs elementets id till i listan över felaktig inmatning
    if (date.value === '') {
      invalidInputs.push(date.id);
      err = true;
    }
  });

  // Om fel uppstod ska inte funktionen fortsätta
  if (err) return;

  // Omvandla inmatade datum till datum-objekt för att jämföra.
  // Skapa även ett objekt för dagens datum för jämförelse
  // setHours gör att jämförelsen kan ske från starten av dygnet. setHours utgår från lokal tid
  // men jag väljer ändå att använda den funktionen här. Jag behöver något som jämför datumen utan att
  // ta hänsyn till timmar, sekunder osv.
  const startDate = new Date(dates[0].value).setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const endDate = new Date(dates[1].value).setHours(0, 0, 0, 0);

  // Kontrollera om start- och slutdatum är felaktigt ifyllda
  if (startDate > endDate || startDate === endDate || startDate < currentDate || endDate < currentDate) {
    // Vid felaktiga datum läggs data som indikerar det i listan över fel
    invalidInputs.push(dates[0].id, dates[1].id);
    err = true;
  }

  if (err) {
    // Om fel finns returnera utan värde
    return;
  } else {
    // Annars läggs information om datum för bokningen i objektet med data om bokningen
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
  document.querySelector('.header').innerHTML = `<h2>Tack för din bokning!</h2>`;

  // Välj aktuella element och uppdatera deras innehåll med utgångspunkt i
  // objektet som lagrar bokningsdatan.
  document.querySelector('.confirmed-name').innerText = bookingData.firstname + ' ' + bookingData.lastname;
  document.querySelector('.confirmed-mail').innerText = bookingData.email;
  document.querySelector('.confirmed-destination').innerText = 'Destination: ' + bookingData.destination;
  document.querySelector('.confirmed-date_from').innerText = 'Datum för avresa: ' + bookingData.date_from;
  document.querySelector('.confirmed-date_to').innerText = 'Datum för hemresa: ' + bookingData.date_to;
  document.querySelector('.confirmed-adress').innerText = bookingData.adress;
  document.querySelector('.confirmed-city').innerText = bookingData.city + ' ' + formatZipCode(bookingData.zip_code);

  const member = document.querySelector('.confirmed-member');
  // Kontrollerar om personen valt att bli medlem genom att fylla i ett lösenord
  if (bookingData.hasOwnProperty('password')) {
    member.innerHTML =
      '<h5>Tack för att du valde att bli medlem!</h5> Information om ditt medlemskap skickas separat till den e-postadress du fyllt i.';
  } else {
    member.innerText = 'Du har valt att inte bli medlem.';
  }
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
    <span class="confirmed-destination"></span>
    <span class="confirmed-date_from"></span>
    <span class="confirmed-date_to"></span>    
  </div>
  <div class="4">
    <h4>Medlem</h4>
    <span class="confirmed-member"></span>
  </div>  
  `;
}

// Funktionen formaterar postnumret så att det visar siffrorna med ett blanksteg
function formatZipCode(zipCodeString) {
  // Delar upp postnumret (som är en textsträng eftersom den kommer från input-fältet)
  let stringArray = zipCodeString.split('');
  // Lägger till ett element som är ett mellanslag
  stringArray.splice(3, 0, ' ');
  // Slår samman arrayen till en textsträng och returnerar den
  return stringArray.join('');
}

// Funktionern renderar felmeddelanden baserat på listan med felaktig inmatning
function renderErrors() {
  // Visar rutan för felmeddelanden
  errorsContainer.classList.remove('hidden');
  let html = '';
  elements.forEach((element) => {
    // Debug
    // console.log(element.id);
    // Varje element som finns i listan med fel ska renderas
    if (invalidInputs.includes(element.id)) {
      element.classList.add('error');
      // Rätt felmeddelande väljs baserat på elementets id
      html += `<li>${errorList[element.id]}</li>`;
    }
  });
  errorsUl.innerHTML = html;
}

// Funktionen återställer utseendet på elementen, dvs tar bort den css-klass som används
// för att indikera felaktigt ifyllda fält i formuläret
function resetErrorFields() {
  elements.forEach((element) => {
    // Debug
    //console.log(element.id, invalidInputs.includes(element.id));
    if (invalidInputs.includes(element.id)) element.classList.remove('error');
  });
}

///////////////////
// Jag har skrivit några regular expressions för att kontrollera
// inmatningen från formuläret. Dessa är på en grundläggande nivå och stoppar
// inte alla tänkbara varianter av fel men åtminstone en del. Jag har lagt ner en del
// tid på att lära mig då jag ser nyttan med det. Svårast var att få kontrollen av lösenordet så
// som jag ville.
///////////////////

// Funktionerna returnerar antingen true eller false beroende på om input-variabeln kan
// matchas med reglerna för respektive regex.
// Inmatningen måste börja med en bokstav, a-ö, ', - eller blanksteg. Det måste finnas
// åtminstone två tecken. Versal/gemen spelar ingen roll
function isValidInput(input) {
  const regex = /^[a-ö, -]{2,}$/i;
  return regex.test(input);
}

// Inmatningen måste börja med a-z, åtminstone ett tecken följt av en eller ingen punkt samt
// fler eller inga ytterligare bokstäver. Därefter måste det finnas ett @ som följs av en eller flera bokstäver
// a-z. Slutligen måste inmatningen innehålla en punkt och därefter mellan 2-4 bokstäver.
function isValidEmail(input) {
  const regex = /^[a-z]+\.*[a-z]*@[a-z]+\.[a-z]{2,4}$/i;
  return regex.test(input);
}

// Inmatningen måste börja med en eller flera bokstäver a-ö. Därefter kan det förekomma ett blanksteg
// som följs av okänt antal ytterligare bokstäver, följt av ytterligare ett eventuellt blanksteg. Det får
// förekomma siffror men det krävs inte. Slutligen tillåts att inmatningen avslutas med mellan 0 och 1 bokstav
function isValidAdress(input) {
  const regex = /^[a-ö]{2,}[ ]*[a-ö]*[ ]*\d*\w?$/i;
  return regex.test(input);
}

// Inmatningen får bestå av minst tre siffror ett mellanslag och därefter
// ytterligare två siffror. Alternativt fem siffror i en följd.
function isValidZipCode(input) {
  const regex = /(^\d{3} \d{2}$)|(^[\d]{5}$)/;
  return regex.test(input);
}

///// Lösenordskontroll
// Det här var det klart svåraste regexet att lösa och innebar att jag behövde fördjupa mina kunskaper
// Jag ville emellertid sätta mig in i hur det fungerar vilket krävde en del inläsning

// Jag vill att det ska krävas någon form av specialtecken men att det ska kunna förekomma var som
// helst i textsträngen. Det har varit det svåraste men jag har funnit att det kan lösas med hjälpa av
// lookahead.

// Här kontrolleras först att det finns minst totalt 6 tecken av de tecken som anges inom []. Det innebär
// att det är fullt möjligt att exempelvis ange 6 stycken a:n, om det inte hade varit för lookahead
// som anges med (?=) och här specificerar att det måste finnas minst ett av: @!@#¤%&? samt en siffra 0-9.
// Det går fortfarande att skriva samma teceken i följd men det måste åtminstone finnas något av de angivna
// specialtecknen oc en siffra någonstans.

// Lösenordet måste alltså bestå av minst totalt 6 av tecknen a-öA-Ö0-9_!"#¤%&=?@£$€.
// Det måste finnas minst 1 specialtecken och en siffra. Den globala flaggan /i gör att det såväl
// gemen som versal går bra.
function isValidPassword(input) {
  const regex = /(?=.*[!"#¤%&=?@£$€]{1,})(?=.*[0-9]){1,}[a-ö0-9!"#¤%&=?@£$€]{6,}/i;
  return regex.test(input);
}
