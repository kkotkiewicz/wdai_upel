var express = require('express');
var router = express.Router();
const Order = require('../models/Order');
const mongooseConnect = require('../lib/mongoose');


router.get('/', function(req, res, next) {
  mongooseConnect();
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

// TODO: gdy już będą gotowe products i accounts to trzeba będzie zmienić
// żeby order_account i order_details były referencjami do odpowiednich modeli
router.post('/', function(req, res, next) {
  mongooseConnect();
  const order_account = req.body.order_account;
  const order_details = req.body.order_details;
  const order_paid = req.body.order_paid;

  const newOrder = new Order({
    order_account,
    order_details,
    order_paid
  });

  newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;