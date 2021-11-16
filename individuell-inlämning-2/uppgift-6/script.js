// prettier-ignore
const konsonanter = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x', 'z'];

const btnTranslate = document.querySelector('#btn-translate');
const inputMessage = document.querySelector('#input-message');
const messagesList = document.querySelector('.messages-list');

let messages = [];
let idCounter = 1;

btnTranslate.addEventListener('click', (e) => {
  e.preventDefault();
  if (!inputMessage.value) {
    console.log('ERROR');
    return;
  }
  // Lägg meddelandet och ett id i listan över meddelanden
  messages.push({ message: toRovarsprak(inputMessage.value), id: idCounter++ });
  // Rendera det senaste meddelandet
  renderNewMessage(messages[messages.length - 1]);
  // Rensa input-fältets innehåll
  inputMessage.value = '';
});

// En funktion som översätter till rövarspråk
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
  let html = `<li class="message" data-id="${id}"></li>`;
  messagesList.insertAdjacentHTML('afterbegin', html);
  const listItem = document.querySelector(`.message[data-id="${id}"]`);
  listItem.innerText = message;

  console.log(messagesList);
}
