const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});
TeacherSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('Teacher', TeacherSchema);
