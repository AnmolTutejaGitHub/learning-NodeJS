const mongoose = require('mongoose');
// mongoose use mongodb behind the scene

// task-manager api --> database name
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

//defining model
// mongoose.model --> takes 2 args 1)name of model 
// 2) definition of field
const User = mongoose.model('User', {
    // can add validaion check etc
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

// instance of model
const me = new User({
    name: 'Anmol',
    age: 19
});

//me.save();// saves to our db // returns Promise
me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log(error);
})
