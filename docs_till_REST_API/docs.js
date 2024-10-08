// @ts-nocheck // to ignore erros in a file

// package.json //now run server by npm run dev
// "scripts": {
//     "start": "node src/index.js",
//     "dev": "nodemon src/index.js"
//   }


// server (uses routes)
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('./db/mongoose'); // just run mongoose to start connection
const User = require('./models/user'); // importing model

const userRoute = require('path/to/userroute');

app.use(express.json()); //will parse json data coming to object form
// json data can be coming throught postman post request

//////////////////////////////////////// without routes 
app.post('/users', (req, res) => {
    // whatever is is req.body is saved as User document in my db
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.get('/users', (req, res) => {
    //mongoose queries // see docs
    User.find({}).then((users) => { //ModelName.mongodb methods // find({}) returns all documents
        res.send(users);
    }).catch((e) => {
        req.status(500).send(e);
    })
})

///////////////////////////////////// using route // no need of app.get etc all of them defined in user route
app.use(userRoute);

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
})





//db > mongoose.js (uses models/Schema)
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/dbname');






// user model
const mongoose = require('mongoose');
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a +ve no.');
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            // uisng npm module
            if (!validator.isEmail(value)) {
                throw new Error('pl provide valid email');
            }
        }
    }
})

module.exports = User;




// Routes > userRoute
const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;






// for mongodb docs referece go to mongodb not added here as will be using mongoose 