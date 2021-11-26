class Person {
  constructor(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
  }
  // En metod som skriver ut att personen äter middag
  eatDinner() {
    const dishes = ['pizza', 'lax med ris', 'tomatsoppa', 'sallad'];
    const dish = this.generateOne(dishes);
    console.log(`${this.name} äter ${dish} till middag`);
  }
  // En metod som skriver ut till konsolen att personen tittar på tv.
  watchTV() {
    console.log(`${this.name} sätter sig hemma i soffan på ${this.address} och tittar på tv`);
    const { show, rating } = this.#generateTVShowAndRating();
    console.log(`${this.name} ser på ett ${show} och tycker det är ${rating}`);
  }

  // En privat metod som genererar ett tv-program och vad personen tycker om det.
  #generateTVShowAndRating() {
    const shows = ['nyhetsinslag', 'reseprogram', 'frågesport-program', 'program om matlagning'];
    const ratings = ['dåligt', 'bra', 'ganska tråkigt', 'det bästa programmet någonsin'];
    const show = this.generateOne(shows);
    const rating = this.generateOne(ratings);
    return { show: show, rating: rating };
  }

  // En metod som tar en array och returnerar ett slumpmässigt element
  generateOne(arr) {
    if (arr === undefined || arr.length === 0) return;
    return arr[Math.floor(Math.random() * arr.length + 1) - 1];
  }
}

// Studentklassen utökar Person-klassen
class Student extends Person {
  constructor(name, age, address, course, grade, school) {
    super(name, age, address);
    this.course = course;
    this.grade = grade;
    this.school = school;
  }

  // En metod som skriver ut att studenten studerar
  study() {
    const studyTimes = ['1 timme', '30 minuter', '3 timmar', '5 timmar'];
    const studyTime = this.generateOne(studyTimes);
    console.log(`${this.name} studerar ${this.course} flitigt i ${studyTime}`);
  }

  // En metod som skriver ut att studentet skriver tentamen
  writeExam() {
    console.log(`${this.name} skriver tentamen i kursen ${this.course} och får betyg ${this.grade}`);
  }
}

// En instans av Person skapas
const bill = new Person('Bill', '51', 'Solvägen 1');
// En instans av Studen skapas
const ellen = new Student('Ellen', '28', 'Månvägen 2', 'grafisk formgivning', 'VG', 'Bildningscentrum');

// Instansen av Person anropar dess metoder
bill.eatDinner();
bill.watchTV();

// En blankrad
console.log('\n');

// Instansen av Student anropar klassens två metoder samt en av Person-klassens metoder
ellen.study();
ellen.writeExam();
ellen.eatDinner();
