
# User's Query

I have created cookies for user my user model has tokens array now how to keep user login when he visits website later

# Response

To keep the user logged in when they revisit the website, you'll need to store the authentication token (or session token) in the user's cookies. Since your user model already has a `tokens` array, the process will involve setting a token in both the database (as part of the user's tokens array) and in the user's browser (via cookies). Here's how you can implement it:

### Steps to Maintain User Login:

1. **Generate Token During Login:**
   When the user logs in, generate a token (typically a JWT or another type of session token), store it in the `tokens` array in your user model, and set the same token as a cookie in the user's browser.

   **Example (Node.js with JWT):**
   ```javascript
   const jwt = require('jsonwebtoken');

   // Generate token after user logs in
   const generateAuthToken = async (user) => {
     const token = jwt.sign({ _id: user._id.toString() }, 'your_secret_key');
     user.tokens = user.tokens.concat({ token });
     await user.save();
     return token;
   };

   app.post('/login', async (req, res) => {
     const user = await User.findByCredentials(req.body.email, req.body.password);
     const token = await generateAuthToken(user);

     // Set token as cookie in response
     res.cookie('auth_token', token, {
       httpOnly: true,  // For security reasons, to prevent client-side access
       secure: true,    // Use 'true' in production with HTTPS
       maxAge: 24 * 60 * 60 * 1000  // Set expiration time for the cookie
     });
     
     res.send({ user });
   });
   ```

2. **Set the Cookie Expiration:**
   Set the cookie's `maxAge` or `expires` option to determine how long the cookie should last. Typically, this could be for a few days or weeks, depending on your requirement.

3. **Verify Token on Subsequent Visits:**
   When the user revisits the site, check if the `auth_token` cookie exists and verify it on the server. If the token is valid, log the user back in.

   **Example:**
   ```javascript
   const auth = async (req, res, next) => {
     try {
       const token = req.cookies.auth_token;
       const decoded = jwt.verify(token, 'your_secret_key');
       const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

       if (!user) {
         throw new Error('Authentication failed');
       }

       req.user = user;
       req.token = token;
       next();
     } catch (e) {
       res.status(401).send({ error: 'Please authenticate.' });
     }
   };
   
   app.get('/profile', auth, (req, res) => {
     res.send(req.user);
   });
   ```

4. **Logout User (Clear Token and Cookie):**
   When the user logs out, remove the token from the `tokens` array in the database and clear the cookie from the user's browser.

   **Example:**
   ```javascript
   app.post('/logout', auth, async (req, res) => {
     try {
       req.user.tokens = req.user.tokens.filter((tokenObj) => tokenObj.token !== req.token);
       await req.user.save();
       
       // Clear cookie
       res.clearCookie('auth_token');
       res.send('Logged out');
     } catch (e) {
       res.status(500).send();
     }
   });
   ```

### Summary:
- Store the JWT (or token) in both the user's browser (as a cookie) and the user's `tokens` array in your database.
- Set appropriate cookie options like `httpOnly`, `secure`, and `maxAge` to control security and expiration.
- On every request, verify the token from the cookie to check if the user is still logged in.



In Express.js, the req object represents the HTTP request and contains various properties and methods related to that request. The lines:
```javascript
  req.user = user;
  req.token = token;
```
Explanation:

	•	req.user: This property is being set to the authenticated user object. When a user successfully logs in, their details (like _id, name, email, etc.) are retrieved from the database and stored in req.user. This allows you to access the user’s information in subsequent middleware functions or route handlers without needing to query the database again.
	•	req.token: This property holds the JWT token that was used to authenticate the user. By storing the token in req.token, you can easily access it later, such as when logging the user out or validating their session.


Usage Example:

Using these properties allows you to simplify the handling of user authentication. For instance, in a route handler, you could do something like this:
```javascript

app.get('/profile', auth, (req, res) => {
  // Access the authenticated user and their token
  res.send({
    user: req.user,   // The authenticated user's details
    token: req.token   // The JWT token used for authentication
  });
});

```

In this example, when the /profile route is accessed, you can easily send back the authenticated user’s information and their token without having to make additional database calls. This improves efficiency and keeps your code clean.

Integrating your backend authentication and user data handling with a React frontend involves several steps. Here’s a breakdown of how to manage user authentication and display user-specific data, like a watchlist, after logging in:

### Set Up the React Login Component

Create a simple login form that collects the user’s credentials (like email and password).

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      // Assuming response contains user data and token
      const { user, token } = response.data;
      
      // Save token in localStorage or cookies
      localStorage.setItem('auth_token', token);
      // Optionally save user data in state or localStorage
      // For a global state, you might use Context or Redux
      // setUser(user); // This can be used if you are managing user state
      
      // Redirect to another page or fetch user data
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
```

### Save User State

You can manage user state in React in several ways. Here are two common approaches:

Using Local State

You can store user data in local state within a parent component or use React’s Context API for global access.



```javascript
import React, { useState } from 'react';
import Login from './Login';
import UserProfile from './UserProfile';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <UserProfile user={user} />
      )}
    </div>
  );
};

export default App;
```


### Fetch User Data After Login

After logging in, you may want to fetch user-specific data like a watchlist. This could be done in a useEffect hook within a component that displays the user’s profile or watchlist.

```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('auth_token');
      try {
        const response = await axios.get('/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWatchlist(response.data);
      } catch (error) {
        console.error('Error fetching watchlist', error);
      }
    };

    fetchWatchlist();
  }, []);

  return (
    <div>
      <h1>Your Watchlist</h1>
      <ul>
        {watchlist.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
```

![alt text](image.png)

```
  function setUser(user) {
  return jwt.sign (user, secret);
  ｝
```
function getUser (token){
  return jwt.verify(token,secret) ;
} 

