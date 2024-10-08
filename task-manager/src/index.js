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

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        res.status(201).send(user); // will send in formateed form
    }).catch((e) => {
        // res.status(400); // updating status
        // res.send(e); // sending error 
        res.status(400).send(e);
    })
})

app.get('/users', (req, res) => {
    //mongoose queries // see docs
    User.find({}).then((users) => { //ModelName.mongodb methods // find({}) returns all documents
        res.send(users);
    }).catch((e) => {
        req.status(500).send(e); // 500 server is down
    })
})

// express gives us way '/users/:anything' pass anything as params
// req.params for '/users/:id' is {id:'id'}
app.get('/users/:id', (req, res) => {
    console.log(req.params); //postman req localhost:3000/users/12345
    // output : { id: '12345' }
    const _id = req.params.id;
    // no need to do newObjectId(_id) in mongoose // it automatically does for us
    User.findById(_id).then((user) => {
        if (!user) { // as may be no user of that id in mongodb
            return res.status(400).send();
        }
        res.send(user);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task);
    }).catch((e) => {
        res.status(400).send(e);
    })
})
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((e) => {
        res.status(500).send(e);
    });
});

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById(_id).then((task) => {
        if (!task) {
            return res.send(404).send();
        }
        res.send(task);
    }).catch((e) => {
        res.status(500).send();
    })
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});