const express = require('express');
const router = express.Router();
const Student = require('../../models/Student');

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

module.exports = router;
