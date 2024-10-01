
// 3b447aac610a08cff115060cb04955c1 -->position stack
// https://positionstack.com/documentation
// const POSITIONS_API_URL = "http://api.positionstack.com/v1/forward?access_key=3b447aac610a08cff115060cb04955c1&query=1600 Pennsylvania Ave NW,WashingtonDC";;
// request({ url: POSITIONS_API_URL, json: true }, (error, response) => {
//     if (error) {
//         console.log("some Unable to connect to location service")
//     } else if (response.body.data[0].length == 0) {
//         console.log("unable to find location");
//     }
//     else {
//         const results = response.body.data[0];
//         //console.log(results);
//         const latitude = results.latitude;
//         const longitude = results.longitude;
//         const city = results.name;
//         console.log("City" + results.name + "Latitiude:" + latitude + "Longitude:" + longitude);
//     }
// })

const request = require('request');
const geocode = (address, callback) => {
    const POSITIONS_API_URL = "http://api.positionstack.com/v1/forward?access_key=3b447aac610a08cff115060cb04955c1&query=" + encodeURIComponent(address);

    request({ url: POSITIONS_API_URL, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to location services!', undefined);
        } else if (!response.body.data || response.body.data.length === 0) { // Corrected condition
            callback("Unable to find location", undefined);
        } else {
            const result = response.body.data[0];
            const latitude = result.latitude;
            const longitude = result.longitude;
            const city = result.name;
            callback(undefined, {
                city,
                latitude,
                longitude
            });
        }
    });
};

module.exports = geocode;