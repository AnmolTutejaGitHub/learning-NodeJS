//43f322fc6f0dcb707d77cfa8d30276d9

//using npm module to make http request
// core node modules require a lot of code 
// some npm modules are wrapper around of modules 
//making it easier to access
// npm modules are not part of core node modules
// core node module is : http

const request = require('request'); //getting the request module
// https://www.npmjs.com/package/request
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const address = process.argv[2];
if (!address) console.log("please provide address");
else {
    geocode(address, (error, data) => {
        if (error) {
            return console.log("Error:", error);
        }

        forecast(data.latitude, data.longitude, (error, forecastData) => {
            if (error) return console.log('Error', error);
            console.log(data.city);
            console.log(forecastData);
        })

    });
}
