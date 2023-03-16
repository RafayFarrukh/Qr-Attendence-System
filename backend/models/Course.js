const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseShortName: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
