const mongoose = require("mongoose");

const ClassSchema = mongoose.Schema({
  Course: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  teacher: {
    email: {
      type: String,
      ref: "Teacher",
    },
  },
  students: [
    {
      stdId: {
        type: String,
        ref: "Student",
      },
    },
  ],
});

module.exports = mongoose.model("Class", ClassSchema);
