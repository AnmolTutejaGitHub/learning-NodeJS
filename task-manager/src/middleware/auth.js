// authentification middleware
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'tokenSecret'); // payload userid

        // find user by id
        // also need to make sure that user tokens array has that token
        // because we will be deleting token once user logs out
        // why is tokens.token  is in the form of  String ('tokens.token' : token) whereas _id is not provided in form of  String  (_id: decoded._id)?
        // That's a special syntax in Mongoose for accessing a property on an array of objects. So you could use tokens.token to say "look for an objet in the tokens array and check it's token property against this value".
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error(); //trigger catch below
        }

        // giving access to route handler of user
        req.user = user;//creating user property in usrr
        req.token = token;
        next();
    }
    catch (e) {
        res.status(401).send({ error: 'Please authenticate' });
    }
}

module.exports = auth;