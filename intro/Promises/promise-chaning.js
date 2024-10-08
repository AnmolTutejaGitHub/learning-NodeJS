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

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount('67040a8bb45dd345b906f798', 2).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
});
