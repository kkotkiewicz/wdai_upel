const mongoose = require('mongoose');
const {model, models, Schema} = mongoose;

const OrderSchema = new Schema({
  order_account: {type: mongoose.Types.ObjectId, ref: 'Account'},
  order_details: Object,
  order_paid: Boolean
}, {
  timestamps: true,
});

module.exports = models?.Order || model('Order', OrderSchema);