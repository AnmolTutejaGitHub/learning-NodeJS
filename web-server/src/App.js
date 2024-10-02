const path = require('path'); //to get path for our public folder to get index.html
// path is core node module

const express = require('express');

// gives current file and directory name
console.log(__dirname); // /Users/anmoltuteja/Desktop/learning-NodeJS/web-server/src
console.log(__filename); // /Users/anmoltuteja/Desktop/learning-NodeJS/web-server/src/App.js

// path to public dir
console.log(path.join(__dirname, '../public'));
const PublicDirectoryPath = path.join(__dirname, '../public');
const app = express();

// use is used to customise our server will learn later
app.use(express.static(PublicDirectoryPath));
// express.static():
// 	•	express.static() is a built -in middleware function in Express.js that serves static files.
// 	•	It is used to serve files from the file system, such as images, CSS, JavaScript, fonts, or HTML files, without having to define specific routes for them.
// 	•	It maps the files in the specified directory to be directly accessible via the URL path.


// app.get(' ') will no longer run as we have made index.html
// app.get('', (req, res) => {
//     res.send('Hello Express');
// })

// app.get('/about', (req, res) => {
//     res.send('about');
// })



// app.get('/help', (req, res) => {
//     res.send({
//         name: 'Anmol',
//         age: 19
//     });
// })

app.listen(3000, () => {
    console.log('Server is up on port 3000');
})
