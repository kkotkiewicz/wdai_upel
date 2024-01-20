var express = require('express');
var cors = require('cors');
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "WdAI Express API",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);


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
