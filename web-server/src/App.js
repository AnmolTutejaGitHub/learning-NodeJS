const express = require('express');

// creating express application
const app = express();

//say domain app.com all it gonna run on a single express server
//app.com/help
//app.com/about
// we have set up multiple routes 

// so how do we set up our server to send our response 
// when someone tries to get something at a particular route
// we set up using get method on app



// configure what server should do when someone tries to get resource
// at a specific url
// get method takes 2 args 1)route 2)func : what we want to do when 
// someone visits that route .
// this func gets called with 2 args 1)obj containing info about the
// incoming request to the server
// 2) response  has methods
app.get('', (req, res) => {
    //send a text response
    res.send('Hello Express');
})

app.get('/help', (req, res) => {
    res.send('Help page');
})

app.get('/about', (req, res) => {
    res.send('about');
})

// starting up server and listen on specific port 
//app.listen(3000);
// can also pass optional argument as callback func 
// which runs when the server is up and running
// the process of starting up a server is asyncronous process

app.listen(3000, () => {
    console.log('Server is up on port 3000');
})
// it stays and listening to request unless we close it


