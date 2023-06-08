const express = require('express');
const router = express.Router();
const Teacher = require('../../models/Teacher');

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
module.exports = router;
