require('../../task-manager/./src/db/mongoose');
const User = require('../../task-manager/./src/models/user');

// 67040a8bb45dd345b906f798

User.findByIdAndUpdate('67040a8bb45dd345b906f798', {
    age: 1, // no need to do set as in mongodb mongoose will take care of it
}).then((user) => {
    console.log(user);
    return User.countDocuments({ age: 1 });
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})
