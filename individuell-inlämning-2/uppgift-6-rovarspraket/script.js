'use strict';

// prettier-ignore
const konsonanter = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x', 'z'];

const btnTranslate = document.querySelector('#btn-translate');
const inputMessage = document.querySelector('#input-message');
const messagesList = document.querySelector('.messages-list');
const messagesSection = document.querySelector('.messages-section');
const errorsSection = document.querySelector('.errors');

// En array som lagrar alla översättningar
let messages = [];
// En enkel räknare som ger varje meddelande/översättning ett nummer
let idCounter = 1;

// Lyssnar efter klick på ul-elementet, dvs listan med tidigare översättningar
messagesList.addEventListener('click', (e) => {
  // Kontrollera på vilket element klicket skedde, endast klick på ta bort-knappen ska hanteras
  if (!e.target.classList.contains('btn-delete')) return;
  // Om det finns ett felmeddelande sedan tidigare tas det bort.
  if (errorsSection.classList.contains('show')) {
    errorsSection.classList.remove('show');
    errorsSection.classList.add('hidden');
  }
  // Hämta id-numret för det listelement som användaren klickade för att ta bort
  const id = e.target.closest('.list-item').getAttribute('data-id');
  // Anropa funktion för att ta bort meddeladet
  deleteMessage(Number(id));
});

// Lyssnar efter klick på knappen för att översätta
btnTranslate.addEventListener('click', (e) => {
  e.preventDefault();
  // Om rutan för input är tom visas ett felmeddelande
  if (!inputMessage.value) {
    showErrorMessage();
    return;
  }
  // Om det finns ett felmeddelande sedan tidigare tas det bort
  if (errorsSection.classList.contains('show')) {
    errorsSection.classList.remove('show');
    errorsSection.classList.add('hidden');
  }
  // Spara varje översättning och ID som ett objekt i listan över meddelanden
  messages.push({
    message: toRovarsprak(inputMessage.value),
    id: idCounter++,
  });
  // Visa det senaste meddelandet på sidan
  renderNewMessage(messages[messages.length - 1]);
  // Rensa input-fältets innehåll
  inputMessage.value = '';
});

// Visar felmeddelande
function showErrorMessage() {
  errorsSection.classList.remove('hidden');
  errorsSection.classList.add('show');
  errorsSection.innerHTML = 'Du måste skriva in en text!';
}

// Funktionen tar emot en textsträng och returnerar texten på rövarspråket
function toRovarsprak(text) {
  return text
    .split('')
    .map((letter) => {
      if (konsonanter.includes(letter.toLowerCase())) {
        return `${letter}o${letter.toLowerCase()}`;
      } else {
        return letter;
      }
    })
    .join('');
}

// Lägger till det senaste meddelandet till html-dokumentet
function renderNewMessage({ message, id }) {
  let html = `<li class="list-item" data-id="${id}">
  <div class="message"></div>
  <div><button class="btn-delete">Ta bort</button></li>`;

  messagesList.insertAdjacentHTML('afterbegin', html);
  const listItem = document.querySelector(`.list-item[data-id="${id}"]`);
  // Sparar som innerText när det nya li-elementet är skapat för att undvika att
  // det besökaren matar in tolkas som kod.
  listItem.childNodes[1].innerText = message;
}

// Tar bort ett meddelande
function deleteMessage(id) {
  // Går igenom listan av översättningar och returnerar dem som inte stämmer överens med id:t som ska tas bort
  messages = messages.filter((message) => message.id !== id);
  // Animerar och tar bort elementet från sidan.
  const listItem = document.querySelector(`.list-item[data-id="${id}"]`);
  listItem.classList.add('fade-out-transition');
  listItem.addEventListener('transitionend', (e) => listItem.remove());
}
