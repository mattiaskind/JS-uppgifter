class Person {

    constructor(name, age, address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    eatDinner() {
        const dishes = ['pizza', 'lax med ris', 'tomatsoppa', 'sallad'];
        const dish = this.generateOne(dishes);
        console.log(`${this.name} äter ${dish} till middag`);
    }

    watchTV() {
        console.log(`${this.name} sätter sig hemma i soffan på ${this.address} och tittar på tv`);
        const { show, rating } = this.#generateTVShowAndRating();
        console.log(`${this.name} ser på ett ${show} och tycker det är ${rating}`);


    }

    #generateTVShowAndRating() {
        const shows = ['nyhetsinslag', 'reseprogram', 'frågesport-program', 'program om matlagning'];
        const ratings = ['dåligt', 'bra', 'ganska tråkigt', 'det bästa programmet någonsin'];
        const show = this.generateOne(shows);
        const rating = this.generateOne(ratings);
        return { show: show, rating: rating };
    }

    generateOne(arr) {
        if (arr === undefined || arr.length === 0) return;
        return arr[Math.floor(Math.random() * arr.length + 1) - 1];
    }
}

class Student extends Person {

    constructor(name, age, address, course, grade, school) {
        super(name, age, address)
        this.course = course;
        this.grade = grade;
        this.school = school;
    }

    study() {
        const studyTimes = ['1 timme', '30 minuter', '3 timmar', '5 timmar'];
        const studyTime = this.generateOne(studyTimes);
        console.log(`${this.name} studerar ${this.course} flitigt i ${studyTime}`);
    }

    writeExam() {
        console.log(`${this.name} skriver tentamen i kursen ${this.course} och får betyg ${this.grade}`);
    }


}


const bill = new Person('Bill', '51', 'Solvägen 1');
const ellen = new Student('Ellen', '28', 'Månvägen 2', 'programmering', 'VG', 'bildningscentrum');

bill.eatDinner();
bill.watchTV();

console.log('\n');

ellen.study()
ellen.writeExam();


