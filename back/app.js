var express = require('express');
var cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

var uploadRouter = require('./routes/upload');
var orderRouter = require('./routes/order');
var courseRouter = require('./routes/course');
var userRouter = require('./routes/user');

app.use('/upload', uploadRouter);
app.use('/order', orderRouter);
app.use('/user', userRouter);
app.use('/course', courseRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
