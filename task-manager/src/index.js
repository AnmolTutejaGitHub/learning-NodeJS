// uses async await
// uses routers

const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000;

// const router = new express.Router();
// router.get('/test', (req, res) => {
//     res.send('This is my route');
// })

// app.use(router); // using router // registering it with my express

app.use(express.json());

app.use(userRouter); //registering a router
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});