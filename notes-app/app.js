const yargs = require('yargs');
const notes = require('./notes');
const chalk = require('chalk');

yargs.version('1.1.0');
// add, remove,read,list -> notes app features


//create add command
//yargs.command takes option object and we can customise it
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: { //all options that our add command will support
        title: {
            describe: 'Note title',
            demandoption: true,//have to provide title to run command correctly
            type: 'string', //title has to be string if left at --title this will be boolean
        },
        body: {
            describe: 'Note body',
            demandoption: true,
            type: 'string'
        }

    },
    handler: function (argv) {
        // console.log('Adding a new note,', argv.title); ////here argv is for builder
        // //node app.js add --title="shoppinglist"
        // console.log(argv.body); //node app.js add --title="Buy" --body="these are to Buy"

        notes.addNote(argv.title, argv.body);

    } // handler will run when node app.js add is typed on terminal
})

// creating the remove command
yargs.command({
    command: "remove",
    describe: "Remove a note",
    builder: {
        title: {
            describe: 'Note title',
            demandoption: true,
            type: 'string'
        }
    },

    handler: function (argv) {
        notes.removeNote(argv.title);
    }
})

// create list command
yargs.command({
    command: 'list',
    describe: 'List your notes',
    handler: function () {
        notes.listNotes();
    }
})

//create read command
yargs.command({
    command: 'read',
    describe: 'Read a notes',
    builder: {
        title: {
            describe: 'Note Title',
            demandoption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        notes.readNote(argv.title);
    }
})

//console.log(yargs.argv);
yargs.parse(); // parse will all parse the arguments will all of the configuration details provided 

