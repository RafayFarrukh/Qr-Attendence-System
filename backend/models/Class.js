const mongoose = require('mongoose');

const ClassSchema = mongoose.Schema({
  Course: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  },
  teacher: {
    email: {
      type: String,
      ref: 'Teacher',
    },
  },
  students: [
    {
      stdId: {
        type: String,
        ref: 'Student',
        unique: true,
      },
    },
  ],
});
ClassSchema.virtual('courseDetails', {
  ref: 'Course',
  localField: 'Course',
  foreignField: '_id',
  justOne: true,
});
ClassSchema.set('toObject', { virtuals: true });
ClassSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Class', ClassSchema);
