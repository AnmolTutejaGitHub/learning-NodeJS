const path = require('path'); //to get path for our public folder to get index.html
// path is core node module

const express = require('express');

const hbs = require('hbs'); //to use partials

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// gives current file and directory name
console.log(__dirname); // /Users/anmoltuteja/Desktop/learning-NodeJS/web-server/src
console.log(__filename); // /Users/anmoltuteja/Desktop/learning-NodeJS/web-server/src/App.js

// path to public dir
console.log(path.join(__dirname, '../public'));
const PublicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();
//note : keep ur alll html,css and js files in public folder as that's 
// what / whose path we provided 


// hbs is npm module
app.set('view engine', 'hbs'); //setting up views
app.set('views', viewsPath); //if want to change name of our views folder need to set views as the newnamedfolder
hbs.registerPartials(partialsPath); //takes path for partials

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


// app.get(' ') will no longer run as we have made index.html
// later for dynamic we deleted index.html in public and made views
// app.get('', (req, res) => {
//     res.send('Hello Express');
// })


app.get('', (req, res) => {
    // we are rendering dynamic content
    // to render one of our views
    //res.render('index'); // no need for extension name
    // will be handled as in view folder

    // coverts out view into html

    // can provide 2nd arg as values we want our view to get
    res.render('index', {
        title: 'Weather App',
        name: 'Anmol'
    });
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({ error: error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    // res.send({
    //     forecast: 'It is snowing',
    //     location: 'oheo',
    //     address: res.query.address
    // })
})

// handling query string in apis
// app.get('/products', (req, res) => {
//     // if url entered is ./product?search=games&rating=5
//     console.log(req.query); // {search:'games',rating:'5'}
//     res.send({
//         products: []
//     })
// })


app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query);
    res.send({
        products: []
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Anmol'
    });//rendering from view
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'this is helpful text',
        title: 'help',
        name: 'Anmol'
    });
})

// 404 page
// '*' --> match with anything that has not been matched
// wild card route
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Anmol',
        errorMessage: 'Help article not found'
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Anmol',
        errorMessage: 'Page not found'
    });
})
app.listen(3000, () => {
    console.log('Server is up on port 3000');
})
