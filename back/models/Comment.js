const mongoose = require("mongoose");
const { model, models, Schema } = mongoose;

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    text: { type: String, required: true },
});

module.exports = models?.Comment || model("Comment", CommentSchema);