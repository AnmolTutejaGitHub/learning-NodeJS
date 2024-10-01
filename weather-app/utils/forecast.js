//const url = 'https://api.weatherstack.com/current?access_key=43f322fc6f0dcb707d77cfa8d30276d9&query=37.8267,-122.42';

// // request takes 2 arguments one is option 2nd is function  want to run
// // callback func takes 2 arg one is erorr other is reponse
// request({ url: url, json: true }, (error, response) => {
//     //const data = JSON.parse(response.body); //response.body has json object
//     // const data = response.body;
//     // console.log(data.current);

//     if (error) {
//         console.log("unable to connect to wether services!");
//     } else if (response.body.error) {
//         console.log("unable to find location");
//     }

//     else {
//         console.log(response.body.current.weather_descriptions[0] + '. It is currently ' + response.body.current.temperature + ' degress out. It feels like ' + response.body.current.feelslike + ' degreess out.');
//     }
// })

const request = require('request');
const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.weatherstack.com/current?access_key=43f322fc6f0dcb707d77cfa8d30276d9&query=' + latitude + ',' + longitude;

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to weather services', undefined);
        } else if (response.body.error) {
            callback('Unable to find location', undefined);
        }
        else {
            callback(undefined, response.body.current.weather_descriptions[0] + '. It is currently ' + response.body.current.temperature + ' degress out. It feels like ' + response.body.current.feelslike + ' degreess out.');
        }
    })

}
module.exports = forecast;