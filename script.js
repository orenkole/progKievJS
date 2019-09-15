let firstName = querySelector('input[name="firstName"]');
let age = querySelector('input[name="age"]');
let email = querySelector('input["name="email"]');
let person = {
    function createPerson(firstName, age, email) {
        this.firstName = firstName;
        this.age = age;
        this.email = email;
    }
    function printPersonData() {
        return "first name: " + this.firstName + " age: " + this.age + " email: " + this.email;
    }
}
let submitButton = querySelector('button[type="submit"]');
submitButton.addEventListener("click", person.printPersonData());