
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





   I mean say someone visits website after 10 days and found himself login ... means his token has been stored somewhere ... how backend manages that

When a user visits the website after several days and still finds themselves logged in, it means that their token (like a JWT) is persisted in the backend. This is typically managed in two ways:

	1.	Token stored in cookies with a long expiration (e.g., 10 days or more).
	2.	Refresh token stored in cookies and a short-lived access token to maintain session security.

Explanation of How It Works:

1. JWT Token Expiration

	•	JWT tokens usually have an expiration time (exp claim), such as 1 hour, 1 day, etc.
	•	If you want a user to remain logged in for 10 days, you can set the expiration of the JWT token to 10 days.

Token Flow:

	1.	User logs in:
	•	The server generates a JWT token (say, valid for 10 days) and sends it to the client as an HTTP-only cookie.
	•	Example: The JWT is signed with a secret and has an expiration date embedded.

```javascript
const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '10d' });
```

2.	Token stored in the browser:
	•	The JWT is stored in a secure, HTTP-only cookie in the user’s browser.
	•	Example of setting the cookie:

```javascript

res.cookie('auth_token', token, { 
  httpOnly: true, 
  maxAge: 10 * 24 * 60 * 60 * 1000  // 10 days in milliseconds
});
```

3.	User revisits after 10 days:
	•	When the user revisits the website, the cookie containing the token is sent to the server.
	•	If the JWT token is still valid (not expired), the server validates the token and allows the user to access protected routes without logging in again.
4.	Server-side Token Validation:
	•	The backend extracts the token from the cookie and validates it using the secret key.

``` javascript
const token = req.cookies.auth_token;
if (token) {
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded.userId;
    next(); // Proceed with the request
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
} else {
  return res.status(401).json({ message: 'No token provided' });
}
```

Potential Risks:

	•	Long token lifetimes can increase the risk of stolen tokens being used for malicious purposes.

2. Using Refresh Tokens for Long-Lived Sessions

A better approach is to use short-lived access tokens (like a JWT) and long-lived refresh tokens to keep users logged in securely over long periods. This is more secure than having a single token that lasts for 10 days or more.

How the Refresh Token Flow Works:

	1.	User logs in:
	•	The server generates two tokens:
	1.	A short-lived access token (JWT) (e.g., valid for 1 hour).
	2.	A long-lived refresh token (e.g., valid for 10 days).
	•	The access token is used for authenticating requests.
	•	The refresh token is stored securely (usually in an HTTP-only cookie).
Example:


```javascript
const accessToken = jwt.sign({ userId: user._id }, 'access_secret_key', { expiresIn: '1h' });
const refreshToken = jwt.sign({ userId: user._id }, 'refresh_secret_key', { expiresIn: '10d' });

res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 }); // 1 hour
res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 10 * 24 * 60 * 60 * 1000 }); // 10 days
```

2.	Access token expires:
	•	After the short-lived access token (JWT) expires (say after 1 hour), the user is no longer authenticated with it.
	•	The user will not be logged out because the refresh token (valid for 10 days) is still valid.
3.	Using the refresh token:
	•	When the access token expires, the client can use the refresh token to request a new access token.
	•	The client sends the refresh token to the server (usually via cookies), and the server verifies the refresh token.
Backend logic:
```javascript
const refreshToken = req.cookies.refresh_token;

if (!refreshToken) {
  return res.status(403).json({ message: 'Refresh token not found, please login again' });
}

// Verify the refresh token
jwt.verify(refreshToken, 'refresh_secret_key', (err, decoded) => {
  if (err) return res.status(403).json({ message: 'Invalid refresh token' });

  // Issue a new access token
  const newAccessToken = jwt.sign({ userId: decoded.userId }, 'access_secret_key', { expiresIn: '1h' });

  // Send new access token to client
  res.cookie('access_token', newAccessToken, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 }); // 1 hour
  res.json({ accessToken: newAccessToken });
});
```

4.	User revisits after 10 days:
	•	If the refresh token is still valid after 10 days, the user can get a new access token and continue their session.
	•	If the refresh token expires, the user will need to log in again.

Why Use Refresh Tokens?

	•	Increased Security: If an access token is stolen, it will expire soon (e.g., 1 hour). The attacker cannot use it beyond that time.
	•	Controlled Session Length: You can allow users to stay logged in for extended periods (e.g., 10 days) while keeping the access token short-lived.
	•	Token Rotation: You can also implement token rotation, where a new refresh token is issued every time the user requests a new access token, ensuring even better security.

Frontend (React) Integration with Refresh Tokens

The frontend will need to handle access token expiration and request a new one when needed. Here’s an example of how the flow works:

	1.	Login Page: On login, both the access token and refresh token are set in HTTP-only cookies.
	2.	API Calls: For each request to protected routes, the access token (automatically sent in cookies) is used.
	3.	Token Expiry: If the access token expires and the backend responds with a 401 Unauthorized, the frontend makes a request to the server to refresh the token.

Example of Token Refresh in React:

```javascript
import axios from 'axios';

// Function to fetch user data with token refresh logic
const fetchUserData = async () => {
  try {
    const response = await axios.get('/api/user/profile'); // Access token is sent automatically in cookies
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      // Access token expired, try to refresh it
      try {
        const refreshResponse = await axios.post('/api/refresh-token'); // This endpoint issues a new access token
        if (refreshResponse.status === 200) {
          // Retry the request with new token
          const newResponse = await axios.get('/api/user/profile');
          return newResponse.data;
        }
      } catch (refreshError) {
        console.log('Refresh token expired, logging out user');
        // Redirect to login page or log out the user
      }
    }
  }
};
```

Summary:

	•	JWTs with long expiration times can be stored in cookies to keep the user logged in.
	•	For a more secure implementation, use short-lived access tokens and long-lived refresh tokens.
	•	When the user revisits after a long time, the refresh token allows them to get a new access token and continue the session.
	•	Access tokens and refresh tokens are typically stored in HTTP-only cookies for security.



![alt text](image.png)

```
  function setUser(user) {
  return jwt.sign (user, secret);
  ｝
```
function getUser (token){
  return jwt.verify(token,secret) ;
} 

