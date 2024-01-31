var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require('../models/Order');
const User = require('../models/User');
const mongooseConnect = require('../lib/mongoose');

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Brak tokena" });

  try {
    const decoded = jwt.verify(token, "wdai_project");
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Nieprawidłowy token" });
  }
};

const isAdmin = (req, res, next) => {
  mongooseConnect();
  const decodedPayload = jwt.decode(req.header("Authorization"));

  const userId = decodedPayload.user.id;

  User.findById(userId)
    .then(user => {
      if (!user || user.user_role !== true) {
        return res.status(403).json({ message: "Brak uprawnień administratora" });
      }
      next();    
    })
    .catch(err => {
      return res.status(403).json({ message: "Brak uprawnień administratora" });
    });
};

router.get('/', isAdmin, function(req, res, next) {
  Order.find()
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:id', function(req, res, next) {
  mongooseConnect();
  Order.findById(req.params.id)
    .then(order => res.json(order))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/user/:id', function(req, res, next) {
  mongooseConnect();
  Order.find({order_account: req.params.id})
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

//jako order account podajemy id konta, jako order details podajemy tablicę id kursów
router.post('/', function(req, res, next) {
  mongooseConnect();
  const order_account = req.body.order_account;
  // sprawdzamy czy istnieje taki użytkownik
  User.findById(order_account)
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: "Nie ma takiego użytkownika" });
      }
    })
    .catch(err => {
      return res.status(400).json({ message: "Nie ma takiego użytkownika" });
    });
  const order_details = req.body.order_details;
  
  // sprawdzamy czy wszystkie kursy są w bazie
  const order_details_ids = order_details.map(course => mongoose.Types.ObjectId(course));
  Course.find({_id: {$in: order_details_ids}})
    .then(courses => {
      if (courses.length !== order_details.length) {
        return res.status(400).json({ message: "Nie ma takiego kursu" });
      }
    })
    .catch(err => {
      return res.status(400).json({ message: "Nie ma takiego kursu" });
    });

  // create new order
  const newOrder = new Order({order_account, order_details, order_paid: true});
  newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;