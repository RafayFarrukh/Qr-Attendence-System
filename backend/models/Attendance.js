const mongoose = require('mongoose');

const AttendanceSchema = mongoose.Schema({
  ClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },

  stdId: {
    type: String,
    ref: 'Student',
  },
  fullName: {
    type: String,
    ref: 'Student',
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
