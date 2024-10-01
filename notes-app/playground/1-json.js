const fs = require('fs');

// const book = {
//     title: 'Ego is Enemy',
//     author: 'Ryan Holiday'
// }

// // const bookJSON = JSON.stringify(book); //converts javascript objects to JSON
// // console.log(bookJSON);

// // const bookOBJ = JSON.parse(bookJSON);
// // console.log(bookOBJ);

// const bookJSON = JSON.stringify(book);
// fs.writeFileSync('1-json.json', bookJSON);


const dataBuffer = fs.readFileSync('1-json.json'); //as we dont get a string but a buffer
//console.log(dataBuffer);
const dataJSON = dataBuffer.toString();
//console.log(dataBuffer.toString());

const data = JSON.parse(dataJSON);
data.name = 'Anmol';
data.age = 20;

const userJSON = JSON.stringify(data);
fs.writeFileSync("1-json.json", userJSON);