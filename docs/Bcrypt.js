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

