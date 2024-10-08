// uses async await
// add start / dev script in package.json so that
// can start the server as npm run dev
// 400s -> user errors 
// 500s -> server errors

const express = require('express');
require('./db/mongoose'); //make sures file runs //  // Ensures database connection is established
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //will parse json data coming to object form
// json data can be coming throught postman post request

app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
})

// express gives us way '/users/:anything' pass anything as params
// req.params for '/users/:id' is {id:'id'}
app.get('/users/:id', async (req, res) => {
    console.log(req.params); //postman req localhost:3000/users/12345
    // output : { id: '12345' }
    const _id = req.params.id;
    // no need to do newObjectId(_id) in mongoose // it automatically does for us
    try {
        const user = await User.findById(_id);
        if (!user) return res.status(404).send();
        res.send(user);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.send(404).send();
        }
        res.send(task);
    }
    catch (e) {
        res.status(500).send();
    }
})



// updating the resource
// postman : localhost:3000/users/67040f43ad3ead64bb0a9221
// body : { "name" : "Anmol Tuteja"}
app.patch('/users/:id', async (req, res) => {

    // whats allowed to update
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    // what we are updating 
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        // option obj : runValidator to run our validator
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
})


app.patch('/tasks/:id', async (req, res) => {

    // waht is allowed to update
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'Completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }


    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send(); // no task to update empy arr
        }

        res.send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
})


// delete users and their task
// deleting a resource

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
})


app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});