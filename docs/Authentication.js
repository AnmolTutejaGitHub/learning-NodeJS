// hashing password 
const bcrypt = require('bcryptjs');
const myfunction = async () => {
    const password = "AnmolTuteja";

    // bcrypt.hash --> to encrypt our password
    // 2 args -> 1) plain password 2)no. of rounds we want to perform
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword); // $2a$08$EgUUHybRnfsRJP9RoCPcDOYUagcmTLtdEgREtiX7qx26fSGTJTSwS

    const isMatch = await bcrypt.compare('AnmolTuteja', hashedPassword);
    console.log(isMatch);

}
myfunction();


// difference bet. hashing and encrypting algo : 
// in encryption algo we get our encrypted value back
// hashing algo are one way algo 
// we can back our original password back from them
// how to compare then ? bcrypt.compare(password,hashedpassword)


// // in our model we have to create schema 
// new syntax 
const userSchema = new mongoose.Schema({
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
    }
})

const User = mongoose.model('User', userSchema);

// now for hashing can go to our post patch and do hashing or can use use middleware
// with middleware we can reqister some functions to run before or
// after events occurs
// save --> can run a code before or after a user is saved
// we can use middleware to hash password before saving to db

// middleware 

// can have pre/ post on a schema 
// 1st arg is the the event 
// 2nd arg is what we want to do
userSchema.pre('save', async function (next) {
    // next --> provided to tell mongoose our code ends 
    // this --> document that is being save
    // individual user 
    const user = this; //can use this directly
    console.log('just before saving');

    // need to only hash the password if user is creating / updating the password not updating only say name
    // there is func for it
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});



// note : certain mongoose features bypasses advance featres like middleware
//routes.js
// in router.post 
const updates = Object.keys(req.body);

// findbyidAndUpdate bypasses middleware : means no hashing
//const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

// updating manually 
const user = await User.findById(req.params.id);
updates.forEach((update) => user[update] = req.body[update]);
await user.save(); // only if updated manually not by findbyidandupdate




//////////////////////////////// logging in users

// adding new route
router.post('/users/login', async (req, res) => {
    try {
        // can make custom methods
        // func defined in userModel
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
})

// usermodel.js
// creating custom methods on our Schema 
// statics will define that func on our model/schema User
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('unable to login');
    }

    return user;
}


// jwt -> JSON WEB TOKEN 
// can send an authentication token when user logged in
// then use that token to authenticate every request
// can let token expire after certain time if dont want user to stay in forever
const jwt = require('jsonwebtoken');

const myFunction = async () => {
    // return value from sign method is new token
    // sign method takes 2 args
    // 1) object that contains data that will be embedded in the token
    // we need to store something that uniquely identify our usr (id)
    // 2) 2nd arg is secret .. provide it random series of character
    // in future will store it in env variable
    // 3) 3rd arg is option which can help us modify our token
    // one option is expirein which is used to expire our token
    const token = jwt.sign({ _id: 'abc123' }, 'thisissecret', { expiresIn: '1 seconds' });
    console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE3Mjg0NTA2MjZ9.NtsRubIcZr2HQAmVM-PMdl9V-_J22cFc-zfQA0g_QY4
    // _____._____.______
    // 1) is base 64 encoded json string . This is
    // known as header . it contains some meta information // Base64 decoder --> {"alg":"HS256","typ":"JWT"}
    // about what type of token is it -- it is JWT and algorithm that was used to genereate it
    // 2) payload --> this is the actual data that we embedded in the token. it is also base 64 .. in our case id 
    // decoder --> {"_id":"abc123","iat":1728450626}
    // https://codebeautify.org/base64-to-json-converter
    // 3) signature : used to verify the token
    // someone must know signature to modify the data
    // to modify the data must know secret 


    //// to verify the token we must know secret that was used to create it
    const data = jwt.verify(token, 'thisissecret');
    console.log(data);
}

myFunction();


userSchema.methods.generateAuthtoken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'tokenSecret');
    console.log("Generated token:", token); // Log token to verify if generation works
    user.tokens = user.tokens.concat({ token });
    await user.save(); // saving as we modified user
    return token;
};

// user model has 
tokens: [{
    token: {
        type: String,
        required: true
    }
}] // tokens array with each element as tokrn