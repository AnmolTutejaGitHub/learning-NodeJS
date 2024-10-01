// 'fs' -> file system
const fs = require('fs'); //loads fs module
fs.writeFileSync('notes.txt', 'This file is created via node.js');
//The fs.writeFileSync method is synchronous.

fs.appendFileSync('notes.txt', '\nadded'); // adding tp file


// importing a file
require('./Console'); //will also execute code inside the file we imported ///relative path
// console.log(name); // error - name not defined but it is there in Console.js it has its own scope
// to use it we must export it from Console.js

//whatever assigned to module.export will be returned by require
//const name = require('./Console');
//console.log(name);

const add = require('./Console');
const sum = add(1, 2);
console.log(sum);


//using npm
const validator = require('validator');
console.log(validator.isEmail("anmol@gmail.com"));

//using chalk library
const chalk = require('chalk'); //from chalkV5 require does not work
console.log(chalk.green.inverse.bold('Success !'));


//getting input from user


console.log(process.argv);
//argv -> argument vector
// node filename.js Anmol // this Anmol will go into argv
console.log(process.argv[2]); //first 2 will be others
const command = process.argv[2];

// can use what user has added
if (command == 'add') {
    console.log("adding");
} else if (command == 'remove') {
    console.log('remove');
}

// node filenmae.js add --title="this is title"
//yargs parsing from terminal
const yargs = require('yargs');
console.log(yargs.argv); //{ _: [ 'add' ], title: 'this is title', '$0': 'ModuleSystem.js' }

//customise yargs version
yargs.version('1.1.0');

//in notes app features required add,remove,read,list

