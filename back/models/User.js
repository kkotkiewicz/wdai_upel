const mongoose = require("mongoose");
const {model, models, Schema} = mongoose;

const UserSchema = new Schema({
    user_firstname: String,
    user_lastname: String,
    user_password: String,
    user_email: String,
    user_photo: String,
    user_role: Boolean
  }, {
    timestamps: true,
});
  
module.exports = models?.User || model('User', UserSchema);