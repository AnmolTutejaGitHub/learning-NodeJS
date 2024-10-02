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

// starting up server and listen on specific port 
//app.listen(3000);
// can also pass optional argument as callback func 
// which runs when the server is up and running
// the process of starting up a server is asyncronous process

app.listen(3000, () => {
    console.log('Server is up on port 3000');
})
// it stays and listening to request unless we close it


// The main difference between rendering an HTML page using a web server versus just clicking on the index.html file directly involves how the browser handles requests and interacts with the file system versus a server:

// 1. Serving via Web Server:

// When using a web server (like Express.js, Apache, or Nginx), the HTML page is served through an HTTP protocol. Here’s what happens:

// 	•	Request/Response Cycle: A client (browser) sends an HTTP request to the server. The server responds with the HTML page, including any additional resources (like CSS, JavaScript, images) that the HTML file links to.
// 	•	Relative Paths & Routing: The server manages routing, so relative paths in the HTML (e.g., /styles.css or /about) are handled by the server, allowing for easier management of file structure and more complex routing logic.
// 	•	Backend Interaction: A web server allows dynamic rendering of content. For instance, the server can fetch data from a database and inject it into the HTML before sending it to the browser. You can handle dynamic requests, API calls, authentication, etc.
// 	•	Security: Web servers handle security protocols like HTTPS, CORS, and others. They also hide the file structure from the user.
// 	•	Cross-Origin Resource Sharing (CORS): When making HTTP requests (like fetching data via fetch() or Axios), browsers enforce security policies, and some functionality (like making API requests to a different server) won’t work properly without the web server handling these rules.

// 2. Opening HTML Directly (File System):

// When you open index.html directly by double-clicking on it or using file://, the browser loads it from your local file system. Here’s how it differs:

// 	•	No HTTP Request/Response: The browser just opens the file as a document. There’s no request sent to a server. You are using the file:// protocol, which means the file is loaded directly from your disk.
// 	•	Limited Functionality: Some features that rely on a web server won’t work. For example:
// 	•	AJAX/Fetch API calls: These can fail due to CORS restrictions since the browser enforces different security rules when loading files from file://.
// 	•	Dynamic Content: You cannot fetch data dynamically from a server or database, as there’s no server-side processing happening.
// 	•	Relative Links: Relative paths that work with a web server may not resolve correctly when opening the file directly. For instance, routing to different paths won’t work properly unless the files are physically present in the location.