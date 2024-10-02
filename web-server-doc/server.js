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
    res.send('<h1>Hello Express</h1>');
})

app.get('/about', (req, res) => {
    res.send('about');
})


// can also send back JSON
app.get('/help', (req, res) => {
    res.send({
        name: 'Anmol',
        age: 19
    }); // will automatically stringify JSON for us
})


/////////////////////////////////////////// Want index.html////////////////////////////////////////////////
// if want to get index.html page as we want write hole index.html code in app.get(' ')
// to do it : 
// gives current file and directory name
console.log(__dirname); // /Users/anmoltuteja/Desktop/learning-NodeJS/web-server/src
console.log(__filename); // /Users/anmoltuteja/Desktop/learning-NodeJS/web-server/src/App.js

// path to public dir
console.log(path.join(__dirname, '../public'));
const PublicDirectoryPath = path.join(__dirname, '../public');

// use is used to customise our server will learn later
//here we are config static .... hbs is for dynamic
//if our public dir has indexedDB.html we gwt that
app.use(express.static(PublicDirectoryPath));
// express.static():
// 	•	express.static() is a built -in middleware function in Express.js that serves static files.
// 	•	It is used to serve files from the file system, such as images, CSS, JavaScript, fonts, or HTML files, without having to define specific routes for them.
// 	•	It maps the files in the specified directory to be directly accessible via the URL path.

// static means our our assests are static and they do not change
// need template engine to render dynamic web pages

// now no need to set app.get(' ') as app.use and for other rotes there was a navigation : :::; 
// When you use app.use(express.static(PublicDirectoryPath)); in an Express.js application, it serves static files (like HTML, CSS, images, and JavaScript) from the directory specified by PublicDirectoryPath. This means that any file inside this directory can be accessed by clients via a direct URL without the need to define specific routes for them using app.get.
// For example:
// 	•	If PublicDirectoryPath is set to a directory called public and there’s a file index.html inside, visiting http://localhost:3000/index.html will directly serve that file.
// Thus, you don’t need to define app.get() for serving static files from this directory. However, if you want to serve dynamic content or other routes not covered by static files, you will still need to use app.get() for those cases.
// If your app only serves static content, you may not need app.get() at all. But for handling routes dynamically, app.get() is necessary.
//Yes, the same concept applies to the /help route if you have a static HTML file for it in your PublicDirectoryPath. For example, if you have a file named help.html in the PublicDirectoryPath, accessing http://localhost:3000/help.html will automatically serve the help.html file without needing an app.get('/help') route.
// However, if you want to serve dynamic content for the /help route, you would still need


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// working with apis 
app.get('/weather', (req, res) => {
    // in urls we type /weater?search=pnp
    // search is query to get it we have .query on req

    function originalApiCall() {
        // fetch data from original api

        res.send({
            // pass the only required data from api that we need as obj

            // when user opens ...link/weather?query='term' 
            // that page will have data related to thar query in json format
            // this can act as 'OURS' api and can fetch ...link/weather?query='term' in our js script
            // see ./public/app.js
        })
    }

    // Call the originalApiCall function
    originalApiCall();
})

// /weather (e.g., domain.com/weather) is a route in your Express.js application, not necessarily a webpage by itself. It defines a specific URL path that your server can handle. In your case, when a user visits the /weather route,
// your server will respond with data, which could be either an HTML page, JSON data, or other types of content.
// In the example you’ve shared, the /weather route responds with JSON data related to the weather forecast based on a query parameter (e.g., domain.com/weather?search=city).

// Key Points:
// 	•	If you access /weather directly in a browser (e.g., http://localhost:3000/weather?search=city), it would show the JSON response. It’s not an actual webpage unless you design it to return HTML content.
// 	•	If it returns JSON (as in your code), it’s commonly referred to as an API endpoint. Other parts of your app, like a frontend JavaScript file, can fetch data from /weather and then display it on a webpage dynamically.
// 	•	If you want /weather to be a webpage, you could modify it to serve an HTML file or use a template engine (like Handlebars or EJS) to render HTML content.



// res.send response from server it can be a webpage or json data or any other
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// starting up server and listen on specific port 
//app.listen(3000);
// can also pass optional argument as callback func 
// which runs when the server is up and running
// the process of starting up a server is asyncronous process

app.listen(3000, () => {
    console.log('Server is up on port 3000');
})