require('../../task-manager/./src/db/mongoose'); // to connect to mongooge
const Task = require('../../task-manager/./src/models/task');


// 6704bd8b7ab84d5cf2790e0a

Task.findByIdAndDelete('6704bd8b7ab84d5cf2790e0a').then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false });
}).then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e);
})


// async await 

const deletetaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

deletetaskAndCount('6704bd8b7ab84d5cf2790e0a').then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})
