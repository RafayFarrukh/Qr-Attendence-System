const express = require('express');
const router = express.Router();
const Student = require('../../models/Student');
const bcrypt = require('bcryptjs');

router.post('/studentProfile/:studentId', async function (req, res, next) {
  try {
    const studentId = req.params.studentId;
    const { image } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    if (!image) {
      return res.status(400).json({ error: 'Please provide image' });
    }

    // Convert the base64-encoded image to a buffer
    const base64Image = image.split(';base64,').pop();
    const data = Buffer.from(base64Image, 'base64');

    // Update the imageUrl field of the student record with the binary data of the image
    student.imageUrl.data = data;
    await student.save();

    return res.status(200).json({ imageUrl: student.imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
router.patch('/updatePassword', async (req, res) => {
  console.log('eing hhit backend');
  const user = req.user;
  const { currentPassword, newPassword } = req.body;
  console.log(currentPassword, newPassword, ' currentPassword, newPassword ');
  try {
    // Find the teacher by ID
    const student = await Student.findById(user._id);
    console.log(student, 'studet');
    if (!student) {
      return res.json({ message: 'student not found', success: false });
    }

    // Check if the current password matches
    const isPasswordCorrect = await student.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      console.log('we are here');
      return res.json({
        message: 'Incorrect Current Password',
        success: false,
      });
    }
    const newPass = await bcrypt.hash(newPassword, 12);
    // Update the password
    student.password = newPass;
    await student.save();

    res.json({ message: 'Password updated successfully', success: true });
  } catch (error) {
    console.error(error);
    res.json({ message: 'Internal server error', success: false });
  }
});

router.patch('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { stdId, email, fullName } = req.body;
  console.log(req.body, id);
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { stdId, email, fullName },
      { new: true },
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Student API
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
