// https://www.npmjs.com/package/validator
// npm libray for validation
const validator = require('validator');

const mongoose = require('mongoose');
// mongoose use mongodb behind the scene

// task-manager api --> database name
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');
// using databse as task-manager-api and can think of User,Task as collection


// mongoose takes Task convert it to lowercase and pularise then stores
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    Completed: {
        type: Boolean,
        default: false
    }
})

const task = new Task({
    description: 'learn mongoose library',
    completed: false
})

task.save().then(() => {
    console.log(task);
}).catch((error) => {
    console.log(error);
})

//defining model
// mongoose.model --> takes 2 args 1)name of model 
// 2) definition of field
const User = mongoose.model('User', {
    // can add validaion check etc
    name: {
        type: String,
        required: true,// validation
        trim: true
    },
    age: {
        type: Number,
        default: 0, // seee documentation
        // custom validator
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
    }
})

// instance of model
const me = new User({
    name: 'Anmol',
    age: 19,
    email: 'anmol@gmail.com',
    password: 'Anmol@123'
});

//me.save();// saves to our db // returns Promise
me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log(error);
})



// data validation --> example age can't be -ve
// data sanitation --> altering data before saving it to db example removing white spaces
