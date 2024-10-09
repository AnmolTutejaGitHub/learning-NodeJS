const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Converted to Schema take advantage of middleware
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
    },
    email: {
        type: String,
        required: true,
        unique: true, // to make this work drop database if testing any before adding unique
        lowercase: true,
        validate(value) {
            // uisng npm module
            if (!validator.isEmail(value)) {
                throw new Error('pl provide valid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error("password can't contain 'password' ");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }] // tokens array with each element as tokrn
});


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


// on instance not class --> can think of it 
// static methods are avail on model 
userSchema.methods.generateAuthtoken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'tokenSecret');
    console.log("Generated token:", token); // Log token to verify if generation works
    user.tokens = user.tokens.concat({ token });
    await user.save(); // saving as we modified user
    return token;
};


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

const User = mongoose.model('User', userSchema);

module.exports = User;