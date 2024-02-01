const mongoose = require("mongoose");
const { model, models, Schema } = mongoose;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
});

const RatingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const CourseSchema = new Schema({
  course_name: String,
  course_instructor: String,
  course_description: String,
  course_photos: [{ type: String }],
  course_category: String,
  course_price: Number,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating"}],
}, {
  timestamps: true,
});

module.exports = models?.Course || model("Course", CourseSchema);
