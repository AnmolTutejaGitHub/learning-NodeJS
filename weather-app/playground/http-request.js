const http = require('http');
const url = "http://api.weatherstack.com/current?access_key=43f322fc6f0dcb707d77cfa8d30276d9&query=40,-75";

//https.request(2args)--> 1st is url 2nd is callback func which gets called after request is mage
const request = http.request(url, (response) => {
    console.log(response);

    let data = '';
    // .on() is event listner
    //data coming in form of chunks //so sore it add it get json
    response.on('data', (chunk) => {
        //console.log(chunk);
        data += chunk.toString(); //comes in form of buffer
    })

    //what to do when data coming ends
    response.on('end', () => {
        console.log(data);
        const body = JSON.parse(data);
        console.log(body);
    })
})

// error handling 
// listening error event to occur
request.on('error', (error) => {
    console.log(error);
});

request.end();//done setting up request



// The http.request() method is used to send the request. It takes two arguments:
// 	•	The first argument is the url.
// 	•	The second argument is a callback function that handles the response when the server responds.

//As the response comes in chunks (because of how streaming works), an event listener for the data event is set up. Each chunk is a Buffer and is converted to a string, accumulating the data.

//Once all data chunks have been received, the end event is triggered. 

// Response (response) Object:
// The response object is passed as an argument to the callback function when the server responds. This object represents the server’s response to your request and holds the incoming data, response headers, and status information.

// Key properties and methods:

// 	•	response.statusCode: The HTTP status code of the response, such as 200 for a successful request, 404 for “Not Found”, or 500 for server errors.
// 	•	response.headers: Contains the headers sent by the server. For example, it may contain content type, content length, and other metadata.