const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
    const user = new User(req.body); // User mongoose model
    // req.body is obj // here creating new user
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/users', async (req, res) => {
    try {
        // User is mongoose model 
        // here using mongoose query on it 
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/:id', async (req, res) => {
    console.log(req.params);
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) return res.status(404).send();
        res.send(user);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

router.patch('/users/:id', async (req, res) => {

    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
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


router.delete('/users/:id', async (req, res) => {
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

module.exports = router;