const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  stdId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: 'Your email is required',
    trim: true,
  },
  password: {
    type: String,
    required: 'Your password is required',
    max: 50,
  },
  fullName: {
    type: String,
    required: true,
  },
  imageUrl: {
    data: Buffer,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  otpTimestamp: { type: Date },
});
module.exports = mongoose.model('Student', StudentSchema);
