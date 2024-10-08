// const { MongoClient } = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// async function main() {
//     const client = new MongoClient(connectionURL);

//     try {
//         await client.connect();
//         console.log('Connected to database successfully');

//         const db = client.db(databaseName);
//         const collection = db.collection('users');

//         const result = await collection.insertOne({
//             name: 'Anmol2',
//             age: 19
//         });

//         console.log('User added with ID:', result.insertedId);
//     } catch (error) {
//         console.error('An error occurred:', error);
//     } finally {
//         await client.close();
//     }
// }

// main().catch(console.error);



// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// console.log('Starting script...');

// MongoClient.connect(connectionURL, (error, client) => {
//     console.log('Attempting to connect to database...');

//     if (error) {
//         console.error('Error connecting to database:', error);
//         return;
//     }

//     console.log('Connected to database successfully');

//     const db = client.db(databaseName);

//     console.log('Attempting to insert document...');

//     db.collection('users').insertOne({
//         name: 'Anmol2',
//         age: 19
//     }, (error, result) => {
//         if (error) {
//             console.error('Unable to insert user:', error);
//         } else if (result) {
//             console.log('User added with ID:', result.insertedId);
//         } else {
//             console.log('Operation completed, but no result returned');
//         }

//         console.log('Closing connection...');
//         client.close(() => {
//             console.log('Connection closed');
//             process.exit(0);  // Explicitly exit the script
//         });
//     });
// });

// console.log('Script execution completed. Waiting for async operations...');





//////////////////////
//mongodb driver
// mongodb@6.9.0

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const run = async () => {
    const client = await MongoClient.connect(connectionURL, { useNewUrlParser: true });
    const db = client.db(databaseName);

    const result = await db.collection('users').insertOne({
        name: 'Anmol',
        age: 19
    });
    console.log(result.insertedId);

    client.close();

    const usersCursor = db.collection('users').find({ age: 19 });
    const count = await usersCursor.count();
    console.log(count);
};

run();