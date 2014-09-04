// a.js

var localVariable = 123;  // not visible outside this file

export default function User(age) {
    this.age = age;
}; // can be imported by other files
