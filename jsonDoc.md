# JSON

---

json.parse() —> JSON string to a JavaScript object

json.stringify() —> JSON.stringify() converts a JavaScript object to a JSON string.

express.json —> express.json() is a built-in middleware in Express that parses incoming JSON payloads from req.body.

sending json as response : 

res.status(200).json({message : “Hello”}) // res.json converts js objects to json

Yes, res.json() in Express converts JavaScript objects to JSON and sends them as a response.

Equivalent to: 

If you use res.json() without manually setting the Content-Type header, Express automatically sets it to application/json for you.

If you use res.send() without explicitly setting the Content-Type, Express **automatically determines the response type** based on the data provided.

res.setHeader("Content-Type", "application/json");
res.status(200).send(JSON.stringify({ message: "Hello" }));

Both fetch and axios automatically handle JSON responses but in slightly different ways:

**Using fetch()**

fetch does **not** automatically parse JSON. You need to explicitly call .json() to convert the response into a JavaScript object.

**Example with fetch**

```jsx
fetch("https://api.example.com/data")
  .then(response => response.json()) // Convert response to JS object
  .then(data => console.log(data)) // Use the JS object
  .catch(error => console.error("Error:", error));
```

✅ .json() is required to parse the response.

**Using axios**

axios **automatically parses** JSON responses, so you don’t need to call .json().

**Example with axios**
```jsx

axios.get("https://api.example.com/data")
  .then(response => console.log(response.data)) // Already a JS object
  .catch(error => console.error("Error:", error));
```