const express = require('express');
const router = express.Router();
const Teacher = require('../../models/Teacher');
const bcrypt = require('bcryptjs');

router.patch('/updateProfile', async (req, res) => {
  const user = req.user;
  const { image } = req.body;
  console.log(user);
  try {
    // Find the teacher by ID
    const teacher = await Teacher.findById(user._id);

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Update the image field
    teacher.image = image;

    // Save the updated teacher
    await teacher.save();

    res.status(200).json({ message: 'Teacher image updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/updatePassword', async (req, res) => {
  const user = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the teacher by ID
    const teacher = await Teacher.findById(user._id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if the current password matches
    const isPasswordCorrect = await teacher.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect Current Password' });
    }
    const newPass = await bcrypt.hash(newPassword, 12);
    // Update the password
    teacher.password = newPass;
    await teacher.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/teacher/:teacherId/makeAdmin', async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    console.log(teacherId);
    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Update the teacher's admin status
    teacher.admin = true;

    // Save the updated teacher
    await teacher.save();

    return res.status(200).json({ message: 'Teacher successfully made admin' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
