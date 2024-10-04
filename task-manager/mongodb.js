// CRUD operations : create,read,update,delete

// mongod --dbpath ~/data/db

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
// In the callback function of mongoClient.connect(), the client object represents a connection to the MongoDB server. 
// This function connects your Node.js application to the MongoDB database.
// 	•	It takes three arguments:
// 	1.	connectionURL: The URL of your MongoDB server.
// 	2.	Options { useNewUrlParser: true }: Helps avoid deprecated URL parsing behavior.
// 	3.	A callback function (error, client) which executes after the connection attempt.
// 	2.	client:
// 	•	Once a connection is successfully made, the client object provides an interface to interact with the MongoDB database. It represents a connection to the MongoDB server.
// 	•	With the client object, you can access the database using client.db(databaseName). The db() method returns a reference to a specific database.
// 	3.	db.collection(‘users’):
// 	•	This returns a reference to the users collection inside the database. A collection in MongoDB is like a table in relational databases, where documents (records) are stored.
// 	4.	Asynchronous operations:
// 	•	insertOne() is an asynchronous function that inserts a new document ({ name: 'Anmol', age: 19 }) into the users collection.
// The client object is provided by the callback function of mongoClient.connect().

// When you pass connectionURL and options to mongoClient.connect(), Node.js tries to establish a connection with the MongoDB server. Once that connection is successful, MongoDB returns a MongoClient object, which is passed into the callback as the client parameter.

// This is a common pattern in asynchronous programming
// 1. Connection Request:

// When you call mongoClient.connect(), internally, Node.js reaches out to the MongoDB server using the connectionURL provided.

// 2. Asynchronous Operation:

// The connection attempt is asynchronous, meaning it doesn’t block the rest of your code.Instead, it takes time to establish the connection, and once the connection is made(or fails), the callback function is executed.

// 3. Callback Execution:

// 	•	If the connection is successful, MongoDB gives back a MongoClient object representing the connection.
// 	•	That object is passed to your callback as the client argument.


// The options object you pass to mongoClient.connect() is used to configure the behavior of the connection to MongoDB. 
// useNewUrlParser: true:
// 	•	Purpose: This option tells MongoDB to use the new, improved URL string parser instead of the old one.
// 	•	Reason: MongoDB introduced a new URL parser because the old one had some inconsistencies and issues.For example, certain connection string formats(e.g., including special characters in the username / password) could cause problems with the older parser.
// 	•	By setting useNewUrlParser: true, you ensure that the connection string is parsed using the updated, more robust logic.
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('some error occured');
    }

    //console.log('connect correctly');

    // getting reference to the database we want to manipulate
    const db = client.db(databaseName);

    // insertOne is asynchronous
    // db.collection('users').insertOne({
    //     name: 'Anmol',
    //     age: 19
    // }); // manipulating collection user in task-manager db

    // insertOne can take 2nd argument whcih is callback func which gets called 
    // when insertion is completed
    // callback func takes 2 args 1) error 2)result 
    // result has operation which contains our inserted obj with unique id
    // ops is property on result 
    // ops is array of document
    db.collection('users').insertOne({
        name: 'Anmol',
        age: 19
    }, (error, result) => {
        if (error) return console.log('unable to insert user');

        console.log(result.ops);
    })

})