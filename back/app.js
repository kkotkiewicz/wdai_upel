var express = require('express');
var cors = require('cors');

const app = express()
const port = 3000

app.use(cors());

var uploadRouter = require('./routes/upload');
var orderRouter = require('./routes/order');

app.use('/upload', uploadRouter);
app.use('/order', orderRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
