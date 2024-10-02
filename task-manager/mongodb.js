// CRUD operations : create,read,update,delete

//////////////////// connecting to mongodb server using node.js////////////////////////
const mongodb = require('mongodb'); // monodb driver npm package

// mongodb client gives us access to func necessary to connect to the database 
const MongoClient = mongodb.MongoClient; // MongoDB client

// connect to local host mongodb server we are running
// mongodb: -->as we are using their protocol
// mongodb server is running on port : 27017
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

//mongoclient.connect takes 2 args 1) connection url
// 2) option object
// 3) callback func which gets called when we gets connected to db
// connecting to db is asyncronous func
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('some error occured');
    }

    //console.log('connect correctly');

    // getting reference to the database we want to manipulate
    const db = client.db(databaseName);

    // insertOne is asynchronous
    db.collection('users').insertOne({
        name: 'Anmol',
        age: 19
    }); // manipulating collection user in task-manager db
})
