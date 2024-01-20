const mongoose = require("mongoose");
const { model, models, Schema } = mongoose;

const RatingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
});

module.exports = models?.Rating || model("Rating", RatingSchema);