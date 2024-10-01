console.log("hey") //console is part of js runtime not js

//A JavaScript runtime is an environment where JavaScript code is executed. It includes everything necessary for running JavaScript, such as the engine to interpret the code and built-in libraries or APIs that the code can use

const name = 'Anmol';

const add = function (a, b) {
    return a + b;
}

//module.exports = name; //to export
module.exports = add; //exporting a function