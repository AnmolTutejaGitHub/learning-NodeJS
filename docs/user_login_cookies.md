
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



![alt text](image.png)

```
  function setUser(user) {
  return jwt.sign (user, secret);
  ｝
```
function getUser (token){
  return jwt.verify(token,secret) ;
} 

